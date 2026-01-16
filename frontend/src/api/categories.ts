import apiClient from './client'
import type { ApiResponse, Category } from '../types/api'

/**
 * API Client pour les catégories
 * Conforme aux endpoints du backend NestJS
 */
export const categoriesAPI = {
  /**
   * Récupérer toutes les catégories
   * GET /categories
   */
  async getAll(): Promise<ApiResponse<Category[]>> {
    return apiClient.get('/categories')
  },

  /**
   * Récupérer l'arbre hiérarchique des catégories
   * GET /categories/tree
   */
  async getTree(): Promise<ApiResponse<Category[]>> {
    return apiClient.get('/categories/tree')
  },

  /**
   * Récupérer une catégorie par ID
   * GET /categories/:id
   */
  async getById(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get(`/categories/${id}`)
  },

  /**
   * Créer une catégorie (Admin)
   * POST /categories
   */
  async create(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiClient.post('/categories', categoryData)
  },

  /**
   * Mettre à jour une catégorie (Admin)
   * PUT /categories/:id
   */
  async update(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiClient.put(`/categories/${id}`, categoryData)
  },

  /**
   * Supprimer une catégorie (Admin)
   * DELETE /categories/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/categories/${id}`)
  },
}