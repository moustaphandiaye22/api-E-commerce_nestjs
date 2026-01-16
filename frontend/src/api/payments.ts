import apiClient from './client'
import type { ApiResponse, Payment, PaymentStats } from '../types/api'

/**
 * API Client pour les paiements (Admin)
 * Conforme aux endpoints du backend NestJS
 */
export const paymentsAPI = {
  /**
   * Lister tous les paiements (Admin)
   * GET /payments
   */
  async getAll(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get('/payments')
  },

  /**
   * Statistiques de paiement (Admin)
   * GET /payments/stats
   */
  async getStats(): Promise<ApiResponse<PaymentStats>> {
    return apiClient.get('/payments/stats')
  },
}