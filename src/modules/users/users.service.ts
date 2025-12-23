import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUsersService } from './interfaces/users.interface';
import { NotFoundException } from '../../common/exceptions/business.exception';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.uTILISATEURS.findMany({
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        telephone: true,
        role: true,
        est_actif: true,
        email_verifie: true,
        cree_le: true,
        modifie_le: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.uTILISATEURS.findUnique({
      where: { id },
      include: {
        adresses: true,
        commandes: {
          select: {
            id: true,
            numero_commande: true,
            statut: true,
            montant_total: true,
            cree_le: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur');
    }
    return user;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.uTILISATEURS.update({
        where: { id },
        data: {
          ...data,
          modifie_le: new Date(),
        },
      });
    } catch (error) {
      throw new NotFoundException('Utilisateur');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.uTILISATEURS.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Utilisateur');
    }
  }

  async createAddress(userId: string, addressData: any) {
    // Vérifier que l'utilisateur existe
    await this.findOne(userId);

    return this.prisma.aDRESSES.create({
      data: {
        ...addressData,
        utilisateur_id: userId,
      },
    });
  }

  async getAddresses(userId: string) {
    // Vérifier que l'utilisateur existe
    await this.findOne(userId);

    return this.prisma.aDRESSES.findMany({
      where: { utilisateur_id: userId },
    });
  }
}