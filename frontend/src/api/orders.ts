import apiClient from './client'
import type { ApiResponse, Order } from '../types/api'

/**
 * API Client pour les commandes
 * Conforme aux endpoints du backend NestJS
 */
export const ordersAPI = {
  /**
   * Lister les commandes de l'utilisateur
   * GET /orders
   */
  async getAll(): Promise<ApiResponse<Order[]>> {
    return apiClient.get('/orders')
  },

  /**
   * Détail d'une commande
   * GET /orders/:id
   */
  async getById(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get(`/orders/${id}`)
  },

  /**
   * Créer une commande depuis le panier
   * POST /orders
   */
  async create(data: { shippingAddress: any; billingAddress: any }): Promise<ApiResponse<Order>> {
    return apiClient.post('/orders', data)
  },
}