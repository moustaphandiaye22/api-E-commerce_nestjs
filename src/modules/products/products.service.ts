import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SlugifyUtil } from '../../common/utils/slugify.util';
import { IProductsService } from './interfaces/products.interface';
import { ValidationException } from '../../common/exceptions/business.exception';

@Injectable()
export class ProductsService implements IProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    const page = parseInt(filters?.page) || 1;
    const limit = parseInt(filters?.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = { est_actif: true };

    if (filters?.category) {
      where.categorie_id = { in: filters.category.split(',') };
    }

    if (filters?.search) {
      where.OR = [
        { nom: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.minPrice) {
      where.prix = { ...where.prix, gte: parseFloat(filters.minPrice) };
    }

    if (filters?.maxPrice) {
      where.prix = { ...where.prix, lte: parseFloat(filters.maxPrice) };
    }

    if (filters?.inStock === 'true') {
      where.quantite_stock = { gt: 0 };
    }

    const [products, total] = await Promise.all([
      this.prisma.pRODUITS.findMany({
        where,
        include: {
          categorie: true,
          images_produits: true,
        },
        skip,
        take: limit,
        orderBy: { cree_le: 'desc' },
      }),
      this.prisma.pRODUITS.count({ where }),
    ]);

    // Transform to include images in expected format
    const transformedProducts = products.map(product => ({
      ...product,
      images: product.images_produits || [],
    }));

    return {
      data: transformedProducts,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.pRODUITS.findUnique({
      where: { id },
      include: {
        categorie: true,
        images_produits: true,
        variantes: true,
        avis: {
          include: {
            utilisateur: {
              select: { prenom: true, nom: true },
            },
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }
    return product;
  }

  async create(data: any) {
    try {
      this.logger.log(`Creating product: ${data.nom}`);
      this.logger.log(`Images data received: ${JSON.stringify(data.images)}`);

      const slug = SlugifyUtil.slugify(data.nom);

      // Extract images from data before creating product
      const { images, ...productData } = data;

      this.logger.log(`Extracted ${images?.length || 0} images from data`);

      // Create the product first
      const product = await this.prisma.pRODUITS.create({
        data: {
          ...productData,
          slug,
          est_actif: data.est_actif !== undefined ? data.est_actif : true,
          est_vedette: data.est_vedette !== undefined ? data.est_vedette : false,
          seuil_stock_bas: data.seuil_stock_bas || 5,
          description_courte: data.description_courte || '',
          prix_compare: data.prix_compare,
          prix_coutant: data.prix_coutant,
        },
        include: {
          categorie: true,
          images_produits: true,
        },
      });

      this.logger.log(`Product created with ID: ${product.id}`);

      // Then create the images if they exist
      if (images && images.length > 0) {
        this.logger.log(`Creating ${images.length} images for product`);
        await this.prisma.iMAGES_PRODUITS.createMany({
          data: images.map((img: any, index: number) => ({
            produit_id: product.id,
            url_image: img.url_image,
            texte_alt: img.texte_alt || product.nom,
            est_principale: img.est_principale || index === 0,
            ordre_tri: index,
          })),
        });
        this.logger.log(`Images created successfully`);
      } else {
        this.logger.warn('No images provided for product creation');
      }

      // Return the product with images
      return this.findOne(product.id);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      this.logger.log(`Updating product: ${id}`);
      this.logger.log(`Images data received: ${JSON.stringify(data.images)}`);

      // Extract images from data before updating product
      const { images, ...productData } = data;

      // Handle empty categorie_id (convert '' to undefined to avoid Prisma error)
      if (productData.categorie_id === '') {
        delete productData.categorie_id;
      }

      // Update the product first
      const product = await this.prisma.pRODUITS.update({
        where: { id },
        data: {
          ...productData,
          slug: data.nom ? SlugifyUtil.slugify(data.nom) : undefined,
        },
        include: {
          categorie: true,
          images_produits: true,
        },
      });

      // If images are provided (even an empty array means we want to update/clear them)
      if (images && Array.isArray(images)) {
        // Delete existing images
        await this.prisma.iMAGES_PRODUITS.deleteMany({
          where: { produit_id: id },
        });

        // Create new images if there are any
        if (images.length > 0) {
          this.logger.log(`Updating ${images.length} images for product`);
          await this.prisma.iMAGES_PRODUITS.createMany({
            data: images.map((img: any, index: number) => ({
              produit_id: product.id,
              url_image: img.url_image,
              texte_alt: img.texte_alt || product.nom,
              est_principale: img.est_principale || index === 0,
              ordre_tri: index,
            })),
          });
          this.logger.log(`Images updated successfully`);
        }
      }

      return this.findOne(product.id);
    } catch (error) {
      console.error('Error updating product:', error);

      // Handle Prisma unique constraint error
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('sku')) {
          throw new ValidationException('Un produit avec ce SKU existe déjà');
        }
        if (target.includes('slug')) {
          throw new ValidationException('Un produit avec ce nom existe déjà');
        }
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Produit non trouvé');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.pRODUITS.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Produit non trouvé');
    }
  }

  async findByCategory(categoryId: string) {
    return this.prisma.pRODUITS.findMany({
      where: {
        categorie_id: categoryId,
        est_actif: true,
      },
      include: {
        images_produits: true,
      },
    });
  }

  async search(query: string) {
    return this.prisma.pRODUITS.findMany({
      where: {
        est_actif: true,
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        categorie: true,
        images_produits: true,
      },
      take: 20,
    });
  }

  async bulkImport(file: any) {
    try {
      this.logger.log(`Starting bulk import with file: ${file?.originalname}`);
      
      if (!file) {
        throw new ValidationException('Aucun fichier fourni');
      }

      const csv = require('csv-parse');
      const fs = require('fs');
      
      const results: any[] = [];
      const errors: any[] = [];
      let imported = 0;

      return new Promise((resolve, reject) => {
        const parser = csv.parse({ columns: true, skip_empty_lines: true });
        
        parser.on('readable', () => {
          let record;
          while ((record = parser.read()) !== null) {
            results.push(record);
          }
        });

        parser.on('error', (err: Error) => {
          reject(err);
        });

        parser.on('end', async () => {
          try {
            for (const row of results) {
              try {
                await this.prisma.pRODUITS.create({
                  data: {
                    nom: row.nom,
                    slug: SlugifyUtil.slugify(row.nom) + '-' + Date.now(),
                    description: row.description || '',
                    description_courte: row.description_courte || '',
                    sku: row.sku || `SKU-${Date.now()}`,
                    prix: parseFloat(row.prix) || 0,
                    quantite_stock: parseInt(row.quantite_stock) || 0,
                    categorie_id: row.categorie_id || null,
                    marque: row.marque || '',
                    est_actif: row.est_actif !== 'false',
                    est_vedette: row.est_vedette === 'true',
                    seuil_stock_bas: parseInt(row.seuil_stock_bas) || 5,
                  },
                });
                imported++;
              } catch (err: any) {
                errors.push({ row, error: err.message });
              }
            }

            resolve({
              imported,
              errors,
            });
          } catch (err) {
            reject(err);
          }
        });

        fs.createReadStream(file.path).pipe(parser);
      });
    } catch (error) {
      this.logger.error(`Error in bulk import: ${error}`);
      throw error;
    }
  }

  async duplicate(id: string) {
    try {
      const originalProduct = await this.prisma.pRODUITS.findUnique({
        where: { id },
        include: {
          images_produits: true,
        },
      });

      if (!originalProduct) {
        throw new NotFoundException('Produit non trouvé');
      }

      const slug = SlugifyUtil.slugify(originalProduct.nom) + '-copie-' + Date.now();

      const duplicatedProduct = await this.prisma.pRODUITS.create({
        data: {
          nom: `${originalProduct.nom} (copie)`,
          slug,
          description: originalProduct.description,
          description_courte: originalProduct.description_courte,
          sku: `${originalProduct.sku}-COP`,
          prix: originalProduct.prix,
          prix_compare: originalProduct.prix_compare,
          prix_coutant: originalProduct.prix_coutant,
          categorie_id: originalProduct.categorie_id,
          marque: originalProduct.marque,
          quantite_stock: originalProduct.quantite_stock,
          seuil_stock_bas: originalProduct.seuil_stock_bas,
          est_actif: false,
          est_vedette: false,
        },
      });

      // Duplicate images if they exist
      if (originalProduct.images_produits && originalProduct.images_produits.length > 0) {
        await this.prisma.iMAGES_PRODUITS.createMany({
          data: originalProduct.images_produits.map((img, index) => ({
            produit_id: duplicatedProduct.id,
            url_image: img.url_image,
            texte_alt: img.texte_alt || duplicatedProduct.nom,
            est_principale: img.est_principale,
            ordre_tri: img.ordre_tri,
          })),
        });
      }

      return this.findOne(duplicatedProduct.id);
    } catch (error) {
      this.logger.error(`Error duplicating product: ${error}`);
      throw error;
    }
  }
}
