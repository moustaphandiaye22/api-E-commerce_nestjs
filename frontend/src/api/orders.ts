import apiClient from './client'
import type { ApiResponse, Order } from '../types/api'

/**
 * Types pour les commandes admin avec informations utilisateur
 */
interface OrderWithUser extends Order {
  utilisateur: {
    id: string
    prenom: string
    nom: string
    email: string
  }
}

/**
 * API Client pour les commandes
 * Conforme aux endpoints du backend NestJS
 */
export const ordersAPI = {
  /**
   * Lister toutes les commandes (Admin)
   * GET /orders/admin/all
   */
  async getAllAdmin(): Promise<ApiResponse<OrderWithUser[]>> {
    return apiClient.get('/orders/admin/all')
  },

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

  /**
   * Mettre à jour le statut d'une commande (Admin)
   * PUT /orders/:id
   */
  async updateOrder(id: string, data: { statut: string }): Promise<ApiResponse<Order>> {
    return apiClient.put(`/orders/${id}`, data)
  },
}
