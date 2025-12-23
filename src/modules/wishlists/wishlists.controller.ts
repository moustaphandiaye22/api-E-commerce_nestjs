import { Controller, Get, Post, Body, Delete, Param, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { WishlistsService } from './wishlists.service';
import { AddToWishlistDtoSchema } from './dto/add-to-wishlist.dto';

@ApiTags('wishlists')
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste de souhaits' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Liste de souhaits',
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
              cree_le: { type: 'string' },
              produit: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nom: { type: 'string' },
                  prix: { type: 'number' },
                  images_produits: { type: 'array' },
                  categorie: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  })
  findUserWishlist(@CurrentUser() user) {
    return this.wishlistsService.findUserWishlist(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Ajouter un produit à la liste de souhaits' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Produit ajouté à la liste de souhaits',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Produit ajouté à la liste de souhaits' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  @ApiResponse({ status: 409, description: 'Produit déjà dans la liste' })
  addToWishlist(@Body() body: { produit_id: string }, @CurrentUser() user) {
    return this.wishlistsService.addToWishlist(user.id, body);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Retirer un produit de la liste de souhaits' })
  @ApiParam({ name: 'productId', description: 'ID du produit', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Produit retiré de la liste de souhaits',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Produit retiré de la liste de souhaits' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé dans la liste' })
  removeFromWishlist(@Param('productId') productId: string, @CurrentUser() user) {
    return this.wishlistsService.removeFromWishlist(user.id, productId);
  }
}