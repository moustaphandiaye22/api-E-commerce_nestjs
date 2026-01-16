import apiClient from './client'
import type { ApiResponse, LoginDto, RegisterDto, LoginResponse, AuthTokens, User } from '../types/api'

/**
 * API Client pour l'authentification
 * Conforme aux endpoints du backend NestJS
 */
export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur
   * POST /auth/register
   */
  async register(userData: RegisterDto): Promise<ApiResponse<{ message: string; user: User }>> {
    return apiClient.post('/auth/register', userData)
  },

  /**
   * Connexion utilisateur
   * POST /auth/login
   * Retourne les tokens ET les infos utilisateur
   */
  async login(credentials: LoginDto): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * Rafraîchir le token
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  },

  /**
   * Déconnexion
   * POST /auth/logout
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post('/auth/logout')
  },
}