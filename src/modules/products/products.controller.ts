import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateProductDtoSchema } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les produits avec filtres' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 })
  @ApiQuery({ name: 'category', required: false, description: 'ID de la catégorie', example: 'uuid' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche textuelle', example: 'smartphone' })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits',
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
              nom: { type: 'string' },
              description: { type: 'string' },
              prix: { type: 'number' },
              categorie: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nom: { type: 'string' },
                },
              },
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    url_image: { type: 'string' },
                    est_principale: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des produits' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche', example: 'smartphone' })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche',
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
              nom: { type: 'string' },
              description: { type: 'string' },
              prix: { type: 'number' },
            },
          },
        },
      },
    },
  })
  search(@Query('q') q: string) {
    return this.productsService.search(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit par ID' })
  @ApiParam({ name: 'id', description: 'ID du produit', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Détail du produit',
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
            nom: { type: 'string' },
            description: { type: 'string' },
            prix: { type: 'number' },
            categorie: { type: 'object' },
            images: { type: 'array' },
            variantes: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau produit (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Produit créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Ressource créée avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nom: { type: 'string' },
            prix: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle insuffisant' })
  @UsePipes(new ZodValidationPipe(CreateProductDtoSchema))
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un produit (Admin)' })
  @ApiParam({ name: 'id', description: 'ID du produit', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Produit mis à jour',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Ressource mise à jour avec succès' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un produit (Admin)' })
  @ApiParam({ name: 'id', description: 'ID du produit', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Produit supprimé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Ressource supprimée avec succès' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}