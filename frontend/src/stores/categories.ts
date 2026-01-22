import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesAPI } from '../api/categories'
import { useApi } from '../composables/useApi'
import type { Category } from '../types/api'

/**
 * Store des catégories
 * Principe: Single Responsibility - Gère uniquement les catégories
 * Optimisation: Cache les données pour éviter les rechargements
 */
export const useCategoriesStore = defineStore('categories', () => {
  // État
  const categories = ref<Category[]>([])
  const categoriesTree = ref<Category[]>([])
  const loaded = ref(false)
  const { loading, error, execute } = useApi<Category[]>()

  /**
   * Récupérer toutes les catégories (avec cache)
   */
  async function fetchCategories(force = false) {
    if (!force && loaded.value && categories.value.length > 0) {
      return categories.value
    }

    return execute(
      async () => {
        const response = await categoriesAPI.getAll()
        categories.value = response.data!
        loaded.value = true
        return response.data!
      }
    )
  }

  /**
   * Récupérer l'arbre hiérarchique des catégories (avec cache)
   */
  async function fetchCategoriesTree(force = false) {
    if (!force && loaded.value && categoriesTree.value.length > 0) {
      return categoriesTree.value
    }

    return execute(
      async () => {
        const response = await categoriesAPI.getTree()
        categoriesTree.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Récupérer une catégorie par ID
   */
  async function fetchCategoryById(id: string) {
    return execute(
      async () => {
        const response = await categoriesAPI.getById(id)
        return response.data!
      }
    )
  }

  /**
   * Vider le cache (utile pour admin après modification)
   */
  function clearCache() {
    categories.value = []
    categoriesTree.value = []
    loaded.value = false
  }

  return {
    // État
    categories,
    categoriesTree,
    loaded,
    loading,
    error,
    // Actions
    fetchCategories,
    fetchCategoriesTree,
    fetchCategoryById,
    clearCache,
  }
})