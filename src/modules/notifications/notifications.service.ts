import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface NotificationData {
  type: 'ORDER_CONFIRMED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'ORDER_SHIPPED' | 'REVIEW_RECEIVED';
  title: string;
  message: string;
  userId: string;
  orderId?: string;
  metadata?: any;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: NotificationData) {
    // For now, we'll just log the notification
    // In a real app, this would send emails, push notifications, etc.
    console.log('Notification created:', {
      type: data.type,
      title: data.title,
      message: data.message,
      userId: data.userId,
      orderId: data.orderId,
      metadata: data.metadata,
      timestamp: new Date(),
    });

    // You could store notifications in database if needed
    // return this.prisma.notifications.create({ ... });

    return {
      id: `notif-${Date.now()}`,
      type: data.type,
      title: data.title,
      message: data.message,
      userId: data.userId,
      orderId: data.orderId,
      read: false,
      createdAt: new Date(),
    };
  }

  async sendOrderConfirmation(orderId: string, userId: string) {
    return this.createNotification({
      type: 'ORDER_CONFIRMED',
      title: 'Commande confirmée',
      message: `Votre commande #${orderId} a été confirmée avec succès.`,
      userId,
      orderId,
    });
  }

  async sendPaymentSuccess(orderId: string, userId: string, amount: string) {
    return this.createNotification({
      type: 'PAYMENT_SUCCESS',
      title: 'Paiement réussi',
      message: `Le paiement de ${amount}€ pour la commande #${orderId} a été effectué avec succès.`,
      userId,
      orderId,
      metadata: { amount },
    });
  }

  async sendPaymentFailed(orderId: string, userId: string) {
    return this.createNotification({
      type: 'PAYMENT_FAILED',
      title: 'Échec du paiement',
      message: `Le paiement pour la commande #${orderId} a échoué. Veuillez réessayer.`,
      userId,
      orderId,
    });
  }

  async sendOrderShipped(orderId: string, userId: string) {
    return this.createNotification({
      type: 'ORDER_SHIPPED',
      title: 'Commande expédiée',
      message: `Votre commande #${orderId} a été expédiée et est en route.`,
      userId,
      orderId,
    });
  }

  async sendReviewReceived(productId: string, userId: string, reviewerName: string) {
    return this.createNotification({
      type: 'REVIEW_RECEIVED',
      title: 'Nouvel avis',
      message: `${reviewerName} a laissé un avis sur votre produit.`,
      userId,
      metadata: { productId, reviewerName },
    });
  }

  // Placeholder for user notifications retrieval
  async getUserNotifications(userId: string) {
    // In a real app, you'd fetch from database
    return {
      notifications: [
        {
          id: 'notif-1',
          type: 'ORDER_CONFIRMED',
          title: 'Commande confirmée',
          message: 'Votre commande a été confirmée',
          read: false,
          createdAt: new Date(),
        },
      ],
      unreadCount: 1,
    };
  }
}