import { ref, unref } from 'vue'
import type { Ref } from 'vue'
import { errorService } from '../services/error.service'

/**
 * Composable pour gérer les appels API avec état de chargement et d'erreur
 * Principe DRY: Évite la duplication de la gestion loading/error dans chaque store
 */
export interface UseApiState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export function useApi<T>() {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Exécute une fonction asynchrone avec gestion automatique du loading/error
   */
  async function execute<R = T>(
    fn: () => Promise<R>,
    options?: {
      onSuccess?: (data: R) => void
      onError?: (error: string) => void
      suppressError?: boolean
    }
  ): Promise<R | null> {
    loading.value = true
    error.value = null

    try {
      const result = await fn()
      
      if (options?.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      const errorMessage = errorService.extractErrorMessage(err)
      error.value = errorMessage
      
      errorService.logError(err, 'useApi')
      
      if (options?.onError) {
        options.onError(errorMessage)
      }
      
      if (!options?.suppressError) {
        throw err
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}