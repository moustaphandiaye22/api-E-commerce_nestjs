import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiError } from '../types/api'
import { errorService } from '../services/error.service'

/**
 * Configuration de base de l'API client
 * Conforme au format de réponse du backend NestJS
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Intercepteur de requête pour ajouter le token JWT
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Intercepteur de réponse pour gérer le format standardisé et les erreurs
 */
apiClient.interceptors.response.use(
  (response) => {
    // Le backend retourne toujours { success, statusCode, message, data }
    // On retourne l'objet ApiResponse complet pour accès au message si nécessaire
    return response.data as ApiResponse
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log l'erreur pour le debugging
    errorService.logError(error, 'API Client')

    // Si le token est expiré (401) et qu'on n'a pas déjà tenté de rafraîchir
    if (errorService.isAuthError(error) && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          // Tentative de rafraîchissement du token
          const response = await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
            '/api/auth/refresh',
            { refresh_token: refreshToken }
          )

          const { access_token, refresh_token: newRefreshToken } = response.data.data!

          // Sauvegarder les nouveaux tokens
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', newRefreshToken)

          // Réessayer la requête originale avec le nouveau token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient