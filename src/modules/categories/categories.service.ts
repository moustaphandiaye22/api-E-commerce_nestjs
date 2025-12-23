import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SlugifyUtil } from '../../common/utils/slugify.util';
import { ICategoriesService } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Simplified query to debug
    return this.prisma.cATEGORIES.findMany({
      where: { est_active: true },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.cATEGORIES.findUnique({
      where: { id },
      include: {
        sous_categories: true,
        categorie_parent: true,
        produits: {
          where: { est_actif: true },
          include: {
            images_produits: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }
    return category;
  }

  async create(data: any) {
    const slug = SlugifyUtil.slugify(data.nom);
    return this.prisma.cATEGORIES.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(id: string, data: any) {
    try {
      if (data.nom) {
        data.slug = SlugifyUtil.slugify(data.nom);
      }
      return await this.prisma.cATEGORIES.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException('Catégorie non trouvée');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.cATEGORIES.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Catégorie non trouvée');
    }
  }

  async findTree() {
    const categories = await this.prisma.cATEGORIES.findMany({
      where: { categorie_parent_id: null, est_active: true },
      include: {
        sous_categories: {
          where: { est_active: true },
          include: {
            sous_categories: {
              where: { est_active: true },
            },
          },
        },
      },
      orderBy: { nom: 'asc' },
    });
    return categories;
  }
}