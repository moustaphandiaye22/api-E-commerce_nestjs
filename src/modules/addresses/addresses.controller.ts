import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer les adresses de l\'utilisateur connecté' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Liste des adresses',
  })
  findUserAddresses(@CurrentUser() user) {
    return this.addressesService.findUserAddresses(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une adresse par ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Adresse trouvée',
  })
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.addressesService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle adresse' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Adresse créée',
  })
  create(@Body() createAddressDto: any, @CurrentUser() user) {
    return this.addressesService.create(user.id, createAddressDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une adresse' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Adresse mise à jour',
  })
  update(@Param('id') id: string, @Body() updateAddressDto: any, @CurrentUser() user) {
    return this.addressesService.update(id, user.id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une adresse' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Adresse supprimée',
  })
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.addressesService.remove(id, user.id);
  }

  @Post(':id/set-default')
  @ApiOperation({ summary: 'Définir une adresse comme adresse par défaut' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Adresse définie par défaut',
  })
  setDefault(@Param('id') id: string, @CurrentUser() user) {
    return this.addressesService.setDefault(id, user.id);
  }
}