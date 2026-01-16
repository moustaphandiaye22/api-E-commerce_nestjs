import apiClient from './client'
import type { ApiResponse, Product, ProductFilters, PaginatedResponse } from '../types/api'

/**
 * API Client pour les produits
 * Conforme aux endpoints du backend NestJS
 */
export const productsAPI = {
  /**
   * Récupérer tous les produits avec filtres
   * GET /products
   */
  async getAll(params?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiClient.get('/products', { params })
  },

  /**
   * Rechercher des produits
   * GET /products/search?q=...
   */
  async search(searchQuery: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get('/products/search', { params: { q: searchQuery } })
  },

  /**
   * Récupérer un produit par ID
   * GET /products/:id
   */
  async getById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get(`/products/${id}`)
  },

  /**
   * Créer un produit (Admin)
   * POST /products
   */
  async create(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.post('/products', productData)
  },

  /**
   * Mettre à jour un produit (Admin)
   * PUT /products/:id
   */
  async update(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put(`/products/${id}`, productData)
  },

  /**
   * Supprimer un produit (Admin)
   * DELETE /products/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/products/${id}`)
  },
}