import apiClient from './client'
import type { ApiResponse } from '../types/api'

/**
 * API Client pour l'upload de fichiers
 * Conforme aux endpoints du backend NestJS
 */
export const uploadAPI = {
  /**
   * Uploader une image
   * POST /upload/image
   */
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}