import apiClient from './client'
import type { ApiResponse, NotificationsResponse } from '../types/api'

/**
 * API Client pour les notifications
 * Conforme aux endpoints du backend NestJS
 */
export const notificationsAPI = {
  /**
   * Récupérer les notifications de l'utilisateur
   * GET /notifications
   */
  async get(): Promise<ApiResponse<NotificationsResponse>> {
    return apiClient.get('/notifications')
  },
}