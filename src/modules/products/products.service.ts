import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SlugifyUtil } from '../../common/utils/slugify.util';
import { IProductsService } from './interfaces/products.interface';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    // Very simple query to debug
    const products = await this.prisma.pRODUITS.findMany({
      where: { est_actif: true },
      take: 10,
    });

    return {
      data: products,
      total: products.length,
      page: 1,
      limit: 10,
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
    const slug = SlugifyUtil.slugify(data.nom);
    return this.prisma.pRODUITS.create({
      data: {
        ...data,
        slug,
      },
      include: {
        categorie: true,
        images_produits: true,
      },
    });
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