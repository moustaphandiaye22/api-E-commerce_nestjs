import { ref, computed } from 'vue'

/**
 * Interface pour les données mises en cache
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000

// Simple in-memory cache for API responses
const cache = ref(new Map<string, CacheEntry<unknown>>())

/**
 * Composable pour la gestion du cache API
 * 
 * Principes SOLID:
 * - Single Responsibility: Gère uniquement le cache
 * - Open/Closed: Facile à étendre avec de nouveaux types
 * 
 * Principe DRY: Réutilisable dans toute l'application
 */
export function useCache() {
  /**
   * Stocker des données dans le cache
   * @param key - Clé unique pour identifier les données
   * @param data - Données à mettre en cache
   * @param ttl - Durée de vie en millisecondes (défaut: 5 minutes)
   */
  function set<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Récupérer des données du cache
   * @param key - Clé des données à récupérer
   * @returns Les données ou null si absentes/expirées
   */
  function get<T>(key: string): T | null {
    const cached = cache.value.get(key)
    if (!cached) return null

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.value.delete(key)
      return null
    }

    return cached.data as T
  }

  /**
   * Vérifier si une clé existe et est valide
   * @param key - Clé à vérifier
   * @returns true si la clé existe et n'est pas expirée
   */
  function has(key: string): boolean {
    const cached = cache.value.get(key)
    if (!cached) return false

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.value.delete(key)
      return false
    }

    return true
  }

  /**
   * Supprimer du cache
   * @param key - Clé à supprimer (si non fournie, vide tout le cache)
   */
  function clear(key?: string): void {
    if (key) {
      cache.value.delete(key)
    } else {
      cache.value.clear()
    }
  }

  /**
   * Obtenir la taille du cache
   */
  const size = computed(() => cache.value.size)

  return {
    set,
    get,
    has,
    clear,
    size
  }
}