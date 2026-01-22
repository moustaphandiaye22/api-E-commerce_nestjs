import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    // Verify product exists
    const product = await this.prisma.pRODUITS.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return this.prisma.aVIS.findMany({
      where: {
        produit_id: productId,
        est_approuve: true,
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
          },
        },
      },
      orderBy: { cree_le: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    try {
      console.log('Creating review with data:', data);
      console.log('User ID:', userId);

      // Verify product exists and is active
      const product = await this.prisma.pRODUITS.findUnique({
        where: { id: data.produit_id },
      });

      if (!product || !product.est_actif) {
        throw new NotFoundException('Produit non trouvé ou indisponible');
      }

      // Check if user has already reviewed this product
      const existingReview = await this.prisma.aVIS.findFirst({
        where: {
          produit_id: data.produit_id,
          utilisateur_id: userId,
        },
      });

      if (existingReview) {
        throw new BadRequestException('Vous avez déjà laissé un avis pour ce produit');
      }

      return this.prisma.aVIS.create({
        data: {
          produit_id: data.produit_id,
          utilisateur_id: userId,
          commande_id: '', // Empty string for commande_id
          note: data.note,
          titre: data.titre,
          commentaire: data.commentaire,
          est_verifie: false, // Not verified without order
          est_approuve: true, // Auto-approve for now
        },
        include: {
          utilisateur: {
            select: {
              id: true,
              prenom: true,
              nom: true,
            },
          },
          produit: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async update(userId: string, reviewId: string, data: Partial<CreateReviewDto>) {
    // Verify review belongs to user
    const review = await this.prisma.aVIS.findFirst({
      where: {
        id: reviewId,
        utilisateur_id: userId,
      },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    return this.prisma.aVIS.update({
      where: { id: reviewId },
      data: {
        ...(data.note && { note: data.note }),
        ...(data.titre && { titre: data.titre }),
        ...(data.commentaire && { commentaire: data.commentaire }),
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
          },
        },
        produit: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  }

  async getProductRating(productId: string) {
    const reviews = await this.prisma.aVIS.findMany({
      where: {
        produit_id: productId,
        est_approuve: true,
      },
      select: { note: true },
    });

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const average = reviews.reduce((sum, review) => sum + review.note, 0) / reviews.length;
    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      count: reviews.length,
    };
  }
}