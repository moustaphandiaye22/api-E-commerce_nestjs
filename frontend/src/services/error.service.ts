import type { ApiError } from '../types/api'

/**
 * Service de gestion centralisée des erreurs
 * Principe: Single Responsibility - Une seule raison de changer
 */
class ErrorService {
  /**
   * Extrait le message d'erreur d'une réponse API
   */
  extractErrorMessage(error: any): string {
    // Erreur API structurée
    if (error.response?.data) {
      const apiError = error.response.data as ApiError
      
      // Message peut être un tableau ou une chaîne
      if (Array.isArray(apiError.message)) {
        return apiError.message.join(', ')
      }
      
      if (apiError.message) {
        return apiError.message
      }
    }

    // Erreur réseau
    if (error.message === 'Network Error') {
      return 'Erreur de connexion au serveur'
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'La requête a pris trop de temps'
    }

    // Message d'erreur par défaut
    return error.message || 'Une erreur inattendue s\'est produite'
  }

  /**
   * Détermine si l'erreur est une erreur d'authentification
   */
  isAuthError(error: any): boolean {
    return error.response?.status === 401
  }

  /**
   * Détermine si l'erreur est une erreur de permissions
   */
  isForbiddenError(error: any): boolean {
    return error.response?.status === 403
  }

  /**
   * Détermine si l'erreur est une erreur de validation
   */
  isValidationError(error: any): boolean {
    return error.response?.status === 400
  }

  /**
   * Détermine si l'erreur est une erreur de ressource non trouvée
   */
  isNotFoundError(error: any): boolean {
    return error.response?.status === 404
  }

  /**
   * Détermine si l'erreur est une erreur de conflit (ex: email déjà utilisé)
   */
  isConflictError(error: any): boolean {
    return error.response?.status === 409
  }

  /**
   * Log l'erreur dans la console (en dev) ou service de monitoring (en prod)
   */
  logError(error: any, context?: string): void {
    if (import.meta.env.DEV) {
      console.error(`[${context || 'Error'}]:`, error)
    }
    // En production, envoyer à un service de monitoring (Sentry, LogRocket, etc.)
  }
}

export const errorService = new ErrorService()