import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { STATUT_COMMANDE } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findUserOrders(userId: string) {
    return this.prisma.cOMMANDES.findMany({
      where: { utilisateur_id: userId },
      include: {
        articles_commande: {
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
            variante: true,
          },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.cOMMANDES.findFirst({
      where: {
        id,
        utilisateur_id: userId,
      },
      include: {
        articles_commande: {
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
            variante: true,
          },
        },
        paiements: true,
        avis: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
              },
            },
          },
        },
        coupons: true,
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    return order;
  }

  async createOrderFromCart(userId: string, shippingAddress: any, billingAddress: any) {
    // Get user cart
    const cart = await this.prisma.pANIERS.findFirst({
      where: { utilisateur_id: userId },
      include: {
        articles_panier: {
          include: {
            produit: true,
            variante: true,
          },
        },
      },
    });

    if (!cart || cart.articles_panier.length === 0) {
      throw new Error('Panier vide');
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    const shippingCost = 10; // Fixed shipping cost

    for (const item of cart.articles_panier) {
      subtotal += Number(item.prix_unitaire) * item.quantite;
    }

    taxAmount = subtotal * 0.2; // 20% tax
    const total = subtotal + taxAmount + shippingCost;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await this.prisma.cOMMANDES.create({
      data: {
        numero_commande: orderNumber,
        utilisateur_id: userId,
        statut: 'EN_ATTENTE',
        sous_total: subtotal.toString(),
        montant_taxe: taxAmount.toString(),
        montant_livraison: shippingCost.toString(),
        montant_reduction: '0',
        montant_total: total.toString(),
        adresse_livraison: shippingAddress,
        adresse_facturation: billingAddress,
      },
    });

    // Create order items from cart
    for (const item of cart.articles_panier) {
      await this.prisma.aRTICLES_COMMANDE.create({
        data: {
          commande_id: order.id,
          produit_id: item.produit_id,
          variante_id: item.variante_id,
          nom_produit: item.produit.nom,
          sku: item.variante?.sku || item.produit.sku,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
          total: (Number(item.prix_unitaire) * item.quantite).toString(),
        },
      });
    }

    // Update stock levels
    for (const item of cart.articles_panier) {
      await this.prisma.pRODUITS.update({
        where: { id: item.produit_id },
        data: {
          quantite_stock: {
            decrement: item.quantite,
          },
        },
      });

      // If variant, update variant stock too
      if (item.variante_id) {
        await this.prisma.vARIANTES_PRODUITS.update({
          where: { id: item.variante_id },
          data: {
            quantite_stock: {
              decrement: item.quantite,
            },
          },
        });
      }
    }

// Clear cart
    await this.prisma.aRTICLES_PANIER.deleteMany({
      where: { panier_id: cart.id },
    });

    return order;
  }

async updateStatus(id: string, statut: STATUT_COMMANDE) {
    const order = await this.prisma.cOMMANDES.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return this.prisma.cOMMANDES.update({
      where: { id },
      data: { statut },
    });
  }
}
