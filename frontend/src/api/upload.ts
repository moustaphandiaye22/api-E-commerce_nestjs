import apiClient from './client'
import type { ApiResponse } from '../types/api'

/**
 * Interface pour la réponse d'upload d'image
 * Le axios interceptor retourne response.data directement, donc on reçoit:
 * { message, data: { url } }
 */
interface UploadResponse {
  success: boolean
  statusCode: number
  message?: string
  data: {
    message: string
    data: {
      url: string
    }
  }
  timestamp: string
  path: string
}

/**
 * API Client pour l'upload de fichiers
 * Conforme aux endpoints du backend NestJS
 */
export const uploadAPI = {
  /**
   * Uploader une image
   * POST /upload/image
   * 
   * Le axios interceptor retourne response.data directement.
   * Structure attendue: { message, data: { url } }
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Extraire l'URL de la réponse
    // Structure: response.data.data.url (le axios interceptor retourne response.data directement)
    const responseAny = response.data as any
    const url = responseAny?.data?.url || responseAny?.url

    if (!url) {
      console.error('Upload response structure:', response.data)
      throw new Error('URL d\'image non retournée par le serveur')
    }

    return { url }
  },
}
