import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async findUserCart(userId: string) {
    const cart = await this.prisma.pANIERS.findFirst({
      where: { utilisateur_id: userId },
      include: {
        articles_panier: {
          include: {
            produit: {
              include: {
                categorie: true,
                images_produits: { where: { est_principale: true }, take: 1 },
              },
            },
            variante: true,
          },
        },
      },
    });

    if (!cart) {
      // Create empty cart if none exists
      const newCart = await this.prisma.pANIERS.create({
        data: {
          utilisateur_id: userId,
          session_id: `user-${userId}-${Date.now()}`,
        },
      });
      return { ...newCart, articles_panier: [] };
    }

    return cart;
  }

  async addItem(userId: string, data: AddToCartDto) {
    // Verify product exists and is active
    const product = await this.prisma.pRODUITS.findUnique({
      where: { id: data.produit_id },
      include: { variantes: true },
    });

    if (!product || !product.est_actif) {
      throw new NotFoundException('Produit non trouvé ou indisponible');
    }

    // If variant specified, verify it exists
    if (data.variante_id) {
      const variant = product.variantes.find(v => v.id === data.variante_id);
      if (!variant) {
        throw new NotFoundException('Variante non trouvée');
      }
    }

    // Get or create user cart
    let cart = await this.prisma.pANIERS.findFirst({
      where: { utilisateur_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.pANIERS.create({
        data: {
          utilisateur_id: userId,
          session_id: `user-${userId}-${Date.now()}`, // Generate unique session for user
        },
      });
    }

    // Check if item already in cart
    const existingItem = await this.prisma.aRTICLES_PANIER.findFirst({
      where: {
        panier_id: cart.id,
        produit_id: data.produit_id,
        variante_id: data.variante_id || null,
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.aRTICLES_PANIER.update({
        where: { id: existingItem.id },
        data: { quantite: existingItem.quantite + data.quantite },
      });
    } else {
      // Create new item
      await this.prisma.aRTICLES_PANIER.create({
        data: {
          panier_id: cart.id,
          produit_id: data.produit_id,
          variante_id: data.variante_id || null,
          quantite: data.quantite,
          prix_unitaire: product.prix,
        },
      });
    }

    // Return the full cart
    return this.findUserCart(userId);
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('La quantité doit être positive');
    }

    // Verify item belongs to user
    const item = await this.prisma.aRTICLES_PANIER.findFirst({
      where: {
        id: itemId,
        panier: { utilisateur_id: userId },
      },
    });

    if (!item) {
      throw new NotFoundException('Article non trouvé dans le panier');
    }

    // Update the item
    await this.prisma.aRTICLES_PANIER.update({
      where: { id: itemId },
      data: { quantite: quantity },
    });

    // Return the full cart
    return this.findUserCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    // Verify item belongs to user
    const item = await this.prisma.aRTICLES_PANIER.findFirst({
      where: {
        id: itemId,
        panier: { utilisateur_id: userId },
      },
    });

    if (!item) {
      throw new NotFoundException('Article non trouvé dans le panier');
    }

    await this.prisma.aRTICLES_PANIER.delete({
      where: { id: itemId },
    });

    return { message: 'Article supprimé du panier' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.pANIERS.findFirst({
      where: { utilisateur_id: userId },
    });

    if (cart) {
      await this.prisma.aRTICLES_PANIER.deleteMany({
        where: { panier_id: cart.id },
      });
    }

    return { message: 'Panier vidé' };
  }
}