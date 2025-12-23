import { Controller, Get, Post, Body, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ReviewsService } from './reviews.service';
import { CreateReviewDtoSchema } from './dto/create-review.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les avis d\'un produit' })
  @ApiParam({ name: 'productId', description: 'ID du produit', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Liste des avis',
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
              note: { type: 'number' },
              titre: { type: 'string' },
              commentaire: { type: 'string' },
              est_verifie: { type: 'boolean' },
              cree_le: { type: 'string' },
              utilisateur: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  prenom: { type: 'string' },
                  nom: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un avis' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Avis créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Avis créé avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            note: { type: 'number' },
            titre: { type: 'string' },
            commentaire: { type: 'string' },
            est_verifie: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Données invalides ou avis déjà existant' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  @UsePipes(new ZodValidationPipe(CreateReviewDtoSchema))
  create(@Body() body: any, @CurrentUser() user) {
    return this.reviewsService.create(user.id, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un avis' })
  @ApiParam({ name: 'id', description: 'ID de l\'avis', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Avis mis à jour',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Avis mis à jour' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user) {
    return this.reviewsService.update(user.id, id, body);
  }
}