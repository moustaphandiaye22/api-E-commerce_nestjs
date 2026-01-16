import apiClient from './client'
import type { ApiResponse, User } from '../types/api'

/**
 * API Client pour les utilisateurs
 * Conforme aux endpoints du backend NestJS
 */
export const usersAPI = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   * GET /users/profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/users/profile')
  },

  /**
   * Récupérer tous les utilisateurs (Admin)
   * GET /users
   */
  async getAll(): Promise<ApiResponse<User[]>> {
    return apiClient.get('/users')
  },

  /**
   * Récupérer un utilisateur par ID
   * GET /users/:id
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(`/users/${id}`)
  },

  /**
   * Mettre à jour un utilisateur
   * PUT /users/:id
   */
  async update(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put(`/users/${id}`, userData)
  },

  /**
   * Supprimer un utilisateur
   * DELETE /users/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/users/${id}`)
  },
}