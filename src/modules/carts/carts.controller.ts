import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CartsService } from './carts.service';
import { AddToCartDtoSchema } from './dto/add-to-cart.dto';

@ApiTags('carts')
@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer le panier de l\'utilisateur connecté' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Panier récupéré',
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
            session_id: { type: 'string' },
            articles_panier: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  quantite: { type: 'number' },
                  prix_unitaire: { type: 'number' },
                  produit: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nom: { type: 'string' },
                      prix: { type: 'number' },
                      images_produits: { type: 'array' },
                    },
                  },
                  variante: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nom: { type: 'string' },
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
  findUserCart(@CurrentUser() user) {
    return this.cartsService.findUserCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Ajouter un article au panier' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Article ajouté au panier',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Article ajouté au panier' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantite: { type: 'number' },
            produit: { type: 'object' },
            variante: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  addItem(@Body() body: { produit_id: string; quantite: number; variante_id?: string }, @CurrentUser() user) {
    return this.cartsService.addItem(user.id, body);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Mettre à jour la quantité d\'un article' })
  @ApiParam({ name: 'itemId', description: 'ID de l\'article panier', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Quantité mise à jour',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Quantité mise à jour' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  updateItem(@Param('itemId') itemId: string, @Body() body: { quantity: number }, @CurrentUser() user) {
    return this.cartsService.updateItemQuantity(user.id, itemId, body.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Supprimer un article du panier' })
  @ApiParam({ name: 'itemId', description: 'ID de l\'article panier', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Article supprimé du panier',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Article supprimé du panier' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  removeItem(@Param('itemId') itemId: string, @CurrentUser() user) {
    return this.cartsService.removeItem(user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Vider le panier' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Panier vidé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Panier vidé' },
      },
    },
  })
  clearCart(@CurrentUser() user) {
    return this.cartsService.clearCart(user.id);
  }
}