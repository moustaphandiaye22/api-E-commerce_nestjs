import { ref, computed } from 'vue'

// Simple in-memory cache for API responses
const cache = ref(new Map<string, { data: any; timestamp: number; ttl: number }>())

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000

export function useCache() {
  const set = (key: string, data: any, ttl = DEFAULT_TTL) => {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  const get = (key: string) => {
    const cached = cache.value.get(key)
    if (!cached) return null

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.value.delete(key)
      return null
    }

    return cached.data
  }

  const has = (key: string) => {
    const cached = cache.value.get(key)
    if (!cached) return false

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.value.delete(key)
      return false
    }

    return true
  }

  const clear = (key?: string) => {
    if (key) {
      cache.value.delete(key)
    } else {
      cache.value.clear()
    }
  }

  const size = computed(() => cache.value.size)

  return {
    set,
    get,
    has,
    clear,
    size
  }
}