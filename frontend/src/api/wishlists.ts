import apiClient from './client'
import type { ApiResponse, WishlistItem } from '../types/api'

/**
 * API Client pour les listes de souhaits
 * Conforme aux endpoints du backend NestJS
 */
export const wishlistsAPI = {
  /**
   * Récupérer la liste de souhaits
   * GET /wishlists
   */
  async get(): Promise<ApiResponse<WishlistItem[]>> {
    return apiClient.get('/wishlists')
  },

  /**
   * Ajouter un produit à la liste de souhaits
   * POST /wishlists
   */
  async add(produit_id: string): Promise<ApiResponse<WishlistItem>> {
    return apiClient.post('/wishlists', { produit_id })
  },

  /**
   * Retirer un produit de la liste de souhaits
   * DELETE /wishlists/:productId
   */
  async remove(productId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/wishlists/${productId}`)
  },
}