import { Controller, Get, Post, Body, Param, UseGuards, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import type { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les paiements (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Liste des paiements',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Données récupérées avec succès' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              montant: { type: 'string' },
              devise: { type: 'string' },
              statut: { type: 'string' },
              methode_paiement: { type: 'string' },
              fournisseur_paiement: { type: 'string' },
              id_transaction: { type: 'string' },
              cree_le: { type: 'string' },
              commande: {
                type: 'object',
                properties: {
                  numero_commande: { type: 'string' },
                  montant_total: { type: 'string' },
                  utilisateur: {
                    type: 'object',
                    properties: {
                      prenom: { type: 'string' },
                      nom: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques de paiement (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Statistiques des paiements',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Statistiques récupérées' },
        data: {
          type: 'object',
          properties: {
            totalPayments: { type: 'number' },
            successfulPayments: { type: 'number' },
            failedPayments: { type: 'number' },
            successRate: { type: 'number' },
            totalAmount: { type: 'string' },
          },
        },
      },
    },
  })
  getStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Post('create-intent/:orderId')
  @ApiOperation({ summary: 'Créer un PaymentIntent Stripe pour une commande' })
  @ApiParam({ name: 'orderId', description: 'ID de la commande', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'PaymentIntent créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'PaymentIntent créé avec succès' },
        data: {
          type: 'object',
          properties: {
            clientSecret: { type: 'string' },
            paymentIntentId: { type: 'string' },
          },
        },
      },
    },
  })
  createPaymentIntent(@Param('orderId') orderId: string) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Webhook Stripe pour les paiements' })
  @ApiResponse({
    status: 200,
    description: 'Webhook traité',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
    },
  })
  handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const rawBody = (req as any).rawBody as Buffer;
    return this.paymentsService.handleWebhook(rawBody, signature, webhookSecret);
  }
}