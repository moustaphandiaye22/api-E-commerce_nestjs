import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateCategoryDtoSchema } from './dto/create-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les catégories' })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories',
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
              slug: { type: 'string' },
              description: { type: 'string' },
              est_active: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Récupérer l\'arbre hiérarchique des catégories' })
  @ApiResponse({
    status: 200,
    description: 'Arbre des catégories',
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
              sous_categories: {
                type: 'array',
                items: { type: 'object' },
              },
            },
          },
        },
      },
    },
  })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une catégorie par ID' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Détail de la catégorie',
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
            slug: { type: 'string' },
            description: { type: 'string' },
            produits: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle catégorie (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Catégorie créée',
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
            slug: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle insuffisant' })
  @UsePipes(new ZodValidationPipe(CreateCategoryDtoSchema))
  create(@Body() createCategoryDto: any) {
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Catégorie mise à jour',
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
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie', example: 'uuid' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Catégorie supprimée',
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
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}