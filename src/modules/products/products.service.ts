import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SlugifyUtil } from '../../common/utils/slugify.util';
import { IProductsService } from './interfaces/products.interface';

@Injectable()
export class ProductsService implements IProductsService {
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
      const slug = SlugifyUtil.slugify(data.nom);
      
      // Extract images from data before creating product
      const { images, ...productData } = data;
      
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

      // Then create the images if they exist
      if (images && images.length > 0) {
        await this.prisma.iMAGES_PRODUITS.createMany({
          data: images.map((img: any, index: number) => ({
            produit_id: product.id,
            url_image: img.url_image,
            texte_alt: img.texte_alt || product.nom,
            est_principale: img.est_principale || index === 0,
            ordre_tri: index,
          })),
        });
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
      // Extract images from data before updating product
      const { images, ...productData } = data;

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

      // If images are provided, update them
      if (images && images.length > 0) {
        // Delete existing images
        await this.prisma.iMAGES_PRODUITS.deleteMany({
          where: { produit_id: id },
        });

        // Create new images
        await this.prisma.iMAGES_PRODUITS.createMany({
          data: images.map((img: any, index: number) => ({
            produit_id: product.id,
            url_image: img.url_image,
            texte_alt: img.texte_alt || product.nom,
            est_principale: img.est_principale || index === 0,
            ordre_tri: index,
          })),
        });
      }

      return this.findOne(product.id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new NotFoundException('Produit non trouvé');
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
}