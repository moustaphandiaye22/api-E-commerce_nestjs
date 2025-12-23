import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CouponsService } from './coupons.service';
import { CreateCouponDtoSchema } from './dto/create-coupon.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les coupons (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Liste des coupons',
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
              code: { type: 'string' },
              description: { type: 'string' },
              type_reduction: { type: 'string' },
              valeur_reduction: { type: 'string' },
              montant_achat_min: { type: 'string' },
              limite_utilisation: { type: 'number' },
              nombre_utilisations: { type: 'number' },
              date_debut: { type: 'string' },
              date_fin: { type: 'string' },
              est_actif: { type: 'boolean' },
              _count: {
                type: 'object',
                properties: {
                  commandes: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un coupon (Admin)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 201,
    description: 'Coupon créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Coupon créé avec succès' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Code déjà utilisé' })
  @UsePipes(new ZodValidationPipe(CreateCouponDtoSchema))
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Valider un coupon' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Coupon validé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Coupon valide' },
        data: {
          type: 'object',
          properties: {
            coupon: { type: 'object' },
            discount: { type: 'number' },
            finalTotal: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Coupon non trouvé' })
  @ApiResponse({ status: 400, description: 'Coupon invalide' })
  validate(@Body() body: { code: string; cartTotal: number }) {
    return this.couponsService.validateCoupon(body.code, body.cartTotal);
  }
}