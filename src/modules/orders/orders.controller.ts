import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les commandes de l\'utilisateur' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Liste des commandes',
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
              numero_commande: { type: 'string' },
              statut: { type: 'string' },
              montant_total: { type: 'string' },
              cree_le: { type: 'string' },
              articles_commande: { type: 'array' },
              paiements: { type: 'array' },
            },
          },
        },
      },
    },
  })
  findUserOrders(@CurrentUser() user) {
    return this.ordersService.findUserOrders(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une commande' })
  @ApiParam({ name: 'id', description: 'ID de la commande', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Détail de la commande',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Données récupérées avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            numero_commande: { type: 'string' },
            statut: { type: 'string' },
            sous_total: { type: 'string' },
            montant_taxe: { type: 'string' },
            montant_livraison: { type: 'string' },
            montant_total: { type: 'string' },
            articles_commande: { type: 'array' },
            paiements: { type: 'array' },
            avis: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.ordersService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une commande depuis le panier' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Commande créée',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Commande créée avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            numero_commande: { type: 'string' },
            montant_total: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Panier vide' })
  create(@Body() body: { shippingAddress: any; billingAddress: any }, @CurrentUser() user) {
    return this.ordersService.createOrderFromCart(user.id, body.shippingAddress, body.billingAddress);
  }
}