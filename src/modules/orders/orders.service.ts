import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findUserOrders(userId: string) {
    // Simplified query to debug
    const orders = await this.prisma.cOMMANDES.findMany({
      where: { utilisateur_id: userId },
      orderBy: { cree_le: 'desc' },
    });

    // Get order items separately
    for (const order of orders) {
      const items = await this.prisma.aRTICLES_COMMANDE.findMany({
        where: { commande_id: order.id },
      });
      (order as any).articles_commande = items;
    }

    return orders;
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

    // Clear cart
    await this.prisma.aRTICLES_PANIER.deleteMany({
      where: { panier_id: cart.id },
    });

    return order;
  }
}