import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cOUPONS.findMany({
      include: {
        _count: {
          select: { commandes: true },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async create(data: CreateCouponDto) {
    // Check if code already exists
    const existing = await this.prisma.cOUPONS.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new BadRequestException('Code coupon déjà utilisé');
    }

    return this.prisma.cOUPONS.create({
      data: {
        code: data.code,
        description: data.description,
        type_reduction: data.type_reduction,
        valeur_reduction: data.valeur_reduction.toString(),
        montant_achat_min: data.montant_achat_min?.toString(),
        montant_reduction_max: data.montant_reduction_max?.toString(),
        limite_utilisation: data.limite_utilisation,
        date_debut: new Date(data.date_debut),
        date_fin: new Date(data.date_fin),
      },
    });
  }

  async validateCoupon(code: string, cartTotal: number) {
    const coupon = await this.prisma.cOUPONS.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon non trouvé');
    }

    if (!coupon.est_actif) {
      throw new BadRequestException('Coupon inactif');
    }

    const now = new Date();
    if (now < coupon.date_debut || now > coupon.date_fin) {
      throw new BadRequestException('Coupon expiré ou pas encore valide');
    }

    // Check minimum purchase amount
    if (coupon.montant_achat_min && cartTotal < Number(coupon.montant_achat_min)) {
      throw new BadRequestException(`Montant minimum d'achat: ${coupon.montant_achat_min}€`);
    }

    // Check usage limit
    if (coupon.limite_utilisation && coupon.nombre_utilisations >= coupon.limite_utilisation) {
      throw new BadRequestException('Coupon épuisé');
    }

    // Calculate discount
    let discount = 0;
    const value = Number(coupon.valeur_reduction);

    if (coupon.type_reduction === 'POURCENTAGE') {
      discount = (cartTotal * value) / 100;
    } else {
      discount = Math.min(value, cartTotal);
    }

    // Apply maximum discount limit
    if (coupon.montant_reduction_max) {
      discount = Math.min(discount, Number(coupon.montant_reduction_max));
    }

    return {
      coupon,
      discount,
      finalTotal: Math.max(0, cartTotal - discount),
    };
  }

  async applyCouponToOrder(orderId: string, couponCode: string) {
    const order = await this.prisma.cOMMANDES.findUnique({
      where: { id: orderId },
      include: { coupons: true },
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    if (order.coupon_id) {
      throw new BadRequestException('Un coupon est déjà appliqué à cette commande');
    }

    const validation = await this.validateCoupon(couponCode, Number(order.montant_total));

    // Update order with discount
    const updatedOrder = await this.prisma.cOMMANDES.update({
      where: { id: orderId },
      data: {
        montant_reduction: validation.discount.toString(),
        montant_total: validation.finalTotal.toString(),
        coupon_id: validation.coupon.id,
      },
      include: { coupons: true },
    });

    // Increment coupon usage
    await this.prisma.cOUPONS.update({
      where: { id: validation.coupon.id },
      data: { nombre_utilisations: { increment: 1 } },
    });

    return updatedOrder;
  }

  async deactivateCoupon(id: string) {
    const coupon = await this.prisma.cOUPONS.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon non trouvé');
    }

    return this.prisma.cOUPONS.update({
      where: { id },
      data: { est_actif: false },
    });
  }
}