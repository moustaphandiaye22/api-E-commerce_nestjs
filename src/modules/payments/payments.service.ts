import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

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
}