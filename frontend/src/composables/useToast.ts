import { ref, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

/**
 * Composable pour les notifications toast
 * Principes SOLID:
 * - Single Responsibility: Gère uniquement les toasts
 * - Open/Closed: Facile à étendre
 * - Dependency Injection: Utilisable partout
 * 
 * Principe DRY: Réutilisable dans toute l'application
 */
const toasts = ref<Toast[]>([])
const toastId = ref(0)

export function useToast() {
  /**
   * Ajouter un toast de succès
   */
  function success(message: string, duration = 4000) {
    return addToast(message, 'success', duration)
  }

  /**
   * Ajouter un toast d'erreur
   */
  function error(message: string, duration = 5000) {
    return addToast(message, 'error', duration)
  }

  /**
   * Ajouter un toast d'avertissement
   */
  function warning(message: string, duration = 4000) {
    return addToast(message, 'warning', duration)
  }

  /**
   * Ajouter un toast d'information
   */
  function info(message: string, duration = 4000) {
    return addToast(message, 'info', duration)
  }

  /**
   * Ajouter un toast personnalisé
   */
  function addToast(message: string, type: ToastType, duration = 4000): string {
    const id = `toast-${++toastId.value}`
    
    toasts.value.push({
      id,
      message,
      type,
      duration
    })

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * Supprimer un toast manuellement
   */
  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Supprimer tous les toasts
   */
  function clearAll() {
    toasts.value = []
  }

  return {
    // État (readonly pour éviter les modifications externes)
    toasts: readonly(toasts),
    
    // Actions
    success,
    error,
    warning,
    info,
    addToast,
    removeToast,
    clearAll
  }
}
