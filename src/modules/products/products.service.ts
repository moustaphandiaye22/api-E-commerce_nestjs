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
          // Removed categorie and avis includes for performance - not needed in list view
          images_produits: true,
        },
        skip,
        take: limit,
        orderBy: { cree_le: 'desc' },
      }),
      this.prisma.pRODUITS.count({ where }),
    ]);

    return {
      data: products,
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
      return await this.prisma.pRODUITS.create({
        data: {
          ...data,
          slug,
          est_actif: data.est_actif !== undefined ? data.est_actif : true,
          est_vedette: data.est_vedette !== undefined ? data.est_vedette : false,
        },
        include: {
          categorie: true,
          images_produits: true,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      if (data.nom) {
        data.slug = SlugifyUtil.slugify(data.nom);
      }
      return await this.prisma.pRODUITS.update({
        where: { id },
        data,
        include: {
          categorie: true,
          images_produits: true,
        },
      });
    } catch (error) {
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