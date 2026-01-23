import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async findAll() {
    return this.prisma.pAIEMENTS.findMany({
      include: {
        commande: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async findByOrder(orderId: string) {
    return this.prisma.pAIEMENTS.findMany({
      where: { commande_id: orderId },
      include: {
        commande: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async createPayment(orderId: string, paymentData: {
    method: string;
    provider: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: any;
  }) {
    // Verify order exists
    const order = await this.prisma.cOMMANDES.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    return this.prisma.pAIEMENTS.create({
      data: {
        commande_id: orderId,
        methode_paiement: paymentData.method,
        fournisseur_paiement: paymentData.provider,
        id_transaction: paymentData.transactionId,
        montant: paymentData.amount.toString(),
        devise: paymentData.currency,
        statut: paymentData.status as any,
        metadonnees: paymentData.metadata || {},
      },
      include: {
        commande: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    return this.prisma.pAIEMENTS.update({
      where: { id: paymentId },
      data: { statut: status as any },
      include: {
        commande: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getPaymentStats() {
    const [totalPayments, successfulPayments, failedPayments] = await Promise.all([
      this.prisma.pAIEMENTS.count(),
      this.prisma.pAIEMENTS.count({ where: { statut: 'REUSSI' } }),
      this.prisma.pAIEMENTS.count({ where: { statut: 'ECHEC' } }),
    ]);

    const totalAmount = await this.prisma.pAIEMENTS.aggregate({
      where: { statut: 'REUSSI' },
      _sum: { montant: true },
    });

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
      totalAmount: totalAmount._sum.montant || '0',
    };
  }

  async createPaymentIntent(orderId: string) {
    // Get order details
    const order = await this.prisma.cOMMANDES.findUnique({
      where: { id: orderId },
      include: {
        utilisateur: {
          select: { email: true, prenom: true, nom: true },
        },
      },
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    const amount = Number(order.montant_total);
    const currency = 'eur';

    // Create Stripe payment intent
    const paymentIntent = await this.stripeService.createPaymentIntent(amount, currency, {
      orderId,
      userId: order.utilisateur_id,
      userEmail: order.utilisateur.email,
    });

    // Create payment record in database
    await this.createPayment(orderId, {
      method: 'stripe',
      provider: 'stripe',
      transactionId: paymentIntent.id,
      amount,
      currency,
      status: 'EN_ATTENTE',
      metadata: { client_secret: paymentIntent.client_secret },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string, webhookSecret: string) {
    try {
      const event = this.stripeService.constructEvent(rawBody, signature, webhookSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    const orderId = paymentIntent.metadata.orderId;

    // Update payment status
    await this.updatePaymentStatus(paymentIntent.id, 'REUSSI');

    // Update order status
    await this.prisma.cOMMANDES.update({
      where: { id: orderId },
      data: { statut: 'CONFIRME' },
    });

    // Update stock levels
    await this.updateStockLevels(orderId);
  }

  private async handlePaymentFailure(paymentIntent: any) {
    const orderId = paymentIntent.metadata.orderId;

    // Update payment status
    await this.updatePaymentStatus(paymentIntent.id, 'ECHEC');

    // Update order status
    await this.prisma.cOMMANDES.update({
      where: { id: orderId },
      data: { statut: 'ANNULE' },
    });
  }

  private async updateStockLevels(orderId: string) {
    const orderItems = await this.prisma.aRTICLES_COMMANDE.findMany({
      where: { commande_id: orderId },
    });

    for (const item of orderItems) {
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
  }
}