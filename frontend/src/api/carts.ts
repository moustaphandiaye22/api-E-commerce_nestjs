import apiClient from './client'
import type { ApiResponse, Cart, AddToCartDto } from '../types/api'

/**
 * API Client pour les paniers
 * Conforme aux endpoints du backend NestJS
 */
export const cartsAPI = {
  /**
   * Récupérer le panier de l'utilisateur connecté
   * GET /carts
   */
  async get(): Promise<ApiResponse<Cart>> {
    return apiClient.get('/carts')
  },

  /**
   * Ajouter un article au panier
   * POST /carts/items
   */
  async addItem(item: AddToCartDto): Promise<ApiResponse<Cart>> {
    return apiClient.post('/carts/items', item)
  },

  /**
   * Mettre à jour la quantité d'un article
   * PUT /carts/items/:itemId
   */
  async updateItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return apiClient.put(`/carts/items/${itemId}`, { quantity })
  },

  /**
   * Supprimer un article du panier
   * DELETE /carts/items/:itemId
   */
  async removeItem(itemId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/carts/items/${itemId}`)
  },

  /**
   * Vider le panier
   * DELETE /carts
   */
  async clear(): Promise<ApiResponse<void>> {
    return apiClient.delete('/carts')
  },
}