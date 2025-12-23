import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToWishlistDtoSchema } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async findUserWishlist(userId: string) {
    return this.prisma.lISTE_SOUHAITS.findMany({
      where: { utilisateur_id: userId },
      include: {
        produit: {
          include: {
            categorie: true,
            images_produits: {
              where: { est_principale: true },
              take: 1,
            },
            variantes: true,
          },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async addToWishlist(userId: string, data: any) {
    // Validate input with Zod
    const validation = AddToWishlistDtoSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      throw new BadRequestException(`Erreurs de validation: ${errorMessages.join(', ')}`);
    }

    const validatedData = validation.data;

    // Verify product exists and is active
    const product = await this.prisma.pRODUITS.findUnique({
      where: { id: validatedData.produit_id },
    });

    if (!product || !product.est_actif) {
      throw new NotFoundException('Produit non trouvé ou indisponible');
    }

    // Check if already in wishlist
    const existing = await this.prisma.lISTE_SOUHAITS.findFirst({
      where: {
        utilisateur_id: userId,
        produit_id: validatedData.produit_id,
      },
    });

    if (existing) {
      throw new ConflictException('Produit déjà dans la liste de souhaits');
    }

    return this.prisma.lISTE_SOUHAITS.create({
      data: {
        utilisateur_id: userId,
        produit_id: validatedData.produit_id,
      },
      include: {
        produit: {
          include: {
            categorie: true,
            images_produits: {
              where: { est_principale: true },
              take: 1,
            },
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.lISTE_SOUHAITS.findFirst({
      where: {
        utilisateur_id: userId,
        produit_id: productId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Produit non trouvé dans la liste de souhaits');
    }

    await this.prisma.lISTE_SOUHAITS.delete({
      where: { id: wishlistItem.id },
    });

    return { message: 'Produit retiré de la liste de souhaits' };
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.prisma.lISTE_SOUHAITS.findFirst({
      where: {
        utilisateur_id: userId,
        produit_id: productId,
      },
    });

    return !!item;
  }
}