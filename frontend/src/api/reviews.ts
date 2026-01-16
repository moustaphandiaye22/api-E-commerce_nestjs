import apiClient from './client'
import type { ApiResponse, Review } from '../types/api'

/**
 * API Client pour les avis
 * Conforme aux endpoints du backend NestJS
 */
export const reviewsAPI = {
  /**
   * Récupérer les avis d'un produit
   * GET /reviews/product/:productId
   */
  async getByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get(`/reviews/product/${productId}`)
  },

  /**
   * Créer un avis
   * POST /reviews
   */
  async create(reviewData: {
    produit_id: string
    note: number
    titre?: string
    commentaire?: string
  }): Promise<ApiResponse<Review>> {
    return apiClient.post('/reviews', reviewData)
  },

  /**
   * Mettre à jour un avis
   * PUT /reviews/:id
   */
  async update(
    id: string,
    reviewData: { note?: number; titre?: string; commentaire?: string }
  ): Promise<ApiResponse<Review>> {
    return apiClient.put(`/reviews/${id}`, reviewData)
  },
}