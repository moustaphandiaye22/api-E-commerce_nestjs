import apiClient from './client'
import type { ApiResponse, Coupon, ValidateCouponDto, CouponValidationResult } from '../types/api'

/**
 * API Client pour les coupons
 * Conforme aux endpoints du backend NestJS
 */
export const couponsAPI = {
  /**
   * Lister tous les coupons (Admin)
   * GET /coupons
   */
  async getAll(): Promise<ApiResponse<Coupon[]>> {
    return apiClient.get('/coupons')
  },

  /**
   * Créer un coupon (Admin)
   * POST /coupons
   */
  async create(couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    return apiClient.post('/coupons', couponData)
  },

  /**
   * Valider un coupon
   * POST /coupons/validate
   */
  async validate(data: ValidateCouponDto): Promise<ApiResponse<CouponValidationResult>> {
    return apiClient.post('/coupons/validate', data)
  },

  /**
   * Mettre à jour un coupon (Admin)
   * PUT /coupons/:id
   */
  async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    return apiClient.put(`/coupons/${id}`, couponData)
  },

  /**
   * Supprimer un coupon (Admin)
   * DELETE /coupons/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/coupons/${id}`)
  },
}
