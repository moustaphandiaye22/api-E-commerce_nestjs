import apiClient from './client'
import type { ApiResponse, Collection } from '../types/api'

/**
 * API Client pour les collections
 */
export const collectionsAPI = {
  /**
   * Récupérer toutes les collections
   * GET /collections
   */
  async getAll(): Promise<ApiResponse<Collection[]>> {
    return apiClient.get('/collections')
  },

  /**
   * Récupérer une collection par ID
   * GET /collections/:id
   */
  async getById(id: string): Promise<ApiResponse<Collection>> {
    return apiClient.get(`/collections/${id}`)
  },

  /**
   * Créer une collection (Admin)
   * POST /collections
   */
  async create(data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    return apiClient.post('/collections', data)
  },

  /**
   * Mettre à jour une collection (Admin)
   * PUT /collections/:id
   */
  async update(id: string, data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    return apiClient.put(`/collections/${id}`, data)
  },

  /**
   * Supprimer une collection (Admin)
   * DELETE /collections/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/collections/${id}`)
  },

  /**
   * Ajouter des produits à une collection (Admin)
   * POST /collections/:id/products
   */
  async addProducts(id: string, produitIds: string[]): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(`/collections/${id}/products`, { produit_ids: produitIds })
  },

  /**
   * Retirer des produits d'une collection (Admin)
   * DELETE /collections/:id/products
   */
  async removeProducts(id: string, produitIds: string[]): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`/collections/${id}/products`, { data: { produit_ids: produitIds } })
  },
}
