import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class AddressesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findUserAddresses(userId: string) {
    return this.prisma.aDRESSES.findMany({
      where: { utilisateur_id: userId },
      orderBy: { cree_le: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.aDRESSES.findFirst({
      where: {
        id,
        utilisateur_id: userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Adresse non trouvée');
    }

    return address;
  }

  async create(userId: string, data: any) {
    const address = await this.prisma.aDRESSES.create({
      data: {
        ...data,
        utilisateur_id: userId,
      },
    });

    this.auditService.logUserAction(userId, 'ADDRESS_CREATED', { addressId: address.id });

    return address;
  }

  async update(id: string, userId: string, data: any) {
    const address = await this.prisma.aDRESSES.findFirst({
      where: {
        id,
        utilisateur_id: userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Adresse non trouvée');
    }

    const updatedAddress = await this.prisma.aDRESSES.update({
      where: { id },
      data,
    });

    this.auditService.logUserAction(userId, 'ADDRESS_UPDATED', { addressId: id });

    return updatedAddress;
  }

  async remove(id: string, userId: string) {
    const address = await this.prisma.aDRESSES.findFirst({
      where: {
        id,
        utilisateur_id: userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Adresse non trouvée');
    }

    await this.prisma.aDRESSES.delete({
      where: { id },
    });

    this.auditService.logUserAction(userId, 'ADDRESS_DELETED', { addressId: id });

    return { message: 'Adresse supprimée' };
  }

  async setDefault(id: string, userId: string) {
    // First, unset all default addresses for this user
    await this.prisma.aDRESSES.updateMany({
      where: { utilisateur_id: userId },
      data: { par_defaut: false },
    });

    // Then set the specified address as default
    const address = await this.prisma.aDRESSES.update({
      where: { id },
      data: { par_defaut: true },
    });

    this.auditService.logUserAction(userId, 'ADDRESS_SET_DEFAULT', { addressId: id });

    return address;
  }
}