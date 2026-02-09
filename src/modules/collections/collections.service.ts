import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SlugifyUtil } from '../../common/utils/slugify.util';
import { ICollectionsService } from './interfaces/collections.interface';

@Injectable()
export class CollectionsService implements ICollectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cOLLECTIONS.findMany({
      include: {
        produits: {
          select: {
            id: true,
            nom: true,
            prix: true,
            images_produits: true,
          },
        },
      },
      orderBy: { ordre_tri: 'asc' },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.cOLLECTIONS.findUnique({
      where: { id },
      include: {
        produits: {
          include: {
            images_produits: true,
            categorie: true,
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection non trouvée');
    }

    return collection;
  }

  async create(data: any) {
    const slug = SlugifyUtil.slugify(data.nom);
    return this.prisma.cOLLECTIONS.create({
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
      return await this.prisma.cOLLECTIONS.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException('Collection non trouvée');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.cOLLECTIONS.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Collection non trouvée');
    }
  }

  async addProducts(collectionId: string, produitIds: string[]) {
    try {
      // First verify collection exists
      const collection = await this.prisma.cOLLECTIONS.findUnique({
        where: { id: collectionId },
      });

      if (!collection) {
        throw new NotFoundException('Collection non trouvée');
      }

      // Connect products to collection
      await this.prisma.cOLLECTIONS.update({
        where: { id: collectionId },
        data: {
          produits: {
            connect: produitIds.map((id) => ({ id })),
          },
        },
      });

      return { success: true, message: 'Produits ajoutés à la collection' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erreur lors de l\'ajout des produits');
    }
  }

  async removeProducts(collectionId: string, produitIds: string[]) {
    try {
      await this.prisma.cOLLECTIONS.update({
        where: { id: collectionId },
        data: {
          produits: {
            disconnect: produitIds.map((id) => ({ id })),
          },
        },
      });

      return { success: true, message: 'Produits retirés de la collection' };
    } catch (error) {
      throw new Error('Erreur lors du retrait des produits');
    }
  }
}
