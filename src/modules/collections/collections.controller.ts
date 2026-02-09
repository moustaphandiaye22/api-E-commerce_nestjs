import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateCollectionDtoSchema, UpdateCollectionDtoSchema, AddProductsToCollectionDtoSchema } from './dto/create-collection.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les collections' })
  @ApiResponse({
    status: 200,
    description: 'Liste des collections',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'array' },
      },
    },
  })
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une collection par ID' })
  @ApiParam({ name: 'id', description: 'ID de la collection', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Détail de la collection' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée' })
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle collection (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Collection créée' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @UsePipes(new ZodValidationPipe(CreateCollectionDtoSchema))
  create(@Body() createCollectionDto: any) {
    return this.collectionsService.create(createCollectionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une collection (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Collection mise à jour' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée' })
  @UsePipes(new ZodValidationPipe(UpdateCollectionDtoSchema))
  update(@Param('id') id: string, @Body() updateCollectionDto: any) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une collection (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Collection supprimée' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée' })
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/products')
  @ApiOperation({ summary: 'Ajouter des produits à une collection (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Produits ajoutés' })
  @UsePipes(new ZodValidationPipe(AddProductsToCollectionDtoSchema))
  addProducts(@Param('id') id: string, @Body() body: any) {
    return this.collectionsService.addProducts(id, body.produit_ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id/products')
  @ApiOperation({ summary: 'Retirer des produits d\'une collection (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Produits retirés' })
  removeProducts(@Param('id') id: string, @Body() body: any) {
    return this.collectionsService.removeProducts(id, body.produit_ids);
  }
}
