import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsAPI } from '../api/products'
import { useApi } from '../composables/useApi'
import type { Product, ProductFilters } from '../types/api'

/**
 * Store des produits
 * Principe: Single Responsibility - Gère uniquement les produits
 */
export const useProductsStore = defineStore('products', () => {
  // État
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const { loading, error, execute } = useApi<Product>()

  // Métadonnées de pagination
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
  })

  /**
   * Récupérer tous les produits avec filtres
   */
  async function fetchProducts(filters?: ProductFilters) {
    return execute(
      async () => {
        const response = await productsAPI.getAll(filters)
        const { data: productList, total, page, limit } = response.data!
        
        products.value = productList
        pagination.value = { total, page, limit }
        
        return response.data!
      }
    )
  }

  /**
   * Récupérer un produit par ID
   */
  async function fetchProductById(id: string) {
    return execute(
      async () => {
        const response = await productsAPI.getById(id)
        currentProduct.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Rechercher des produits
   */
  async function searchProducts(query: string) {
    return execute(
      async () => {
        const response = await productsAPI.search(query)
        products.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Créer un produit (Admin)
   */
  async function createProduct(productData: Partial<Product>) {
    return execute(
      async () => {
        const response = await productsAPI.create(productData)
        products.value.unshift(response.data!)
        return response.data!
      }
    )
  }

  /**
   * Mettre à jour un produit (Admin)
   */
  async function updateProduct(id: string, productData: Partial<Product>) {
    return execute(
      async () => {
        const response = await productsAPI.update(id, productData)
        const index = products.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          products.value[index] = response.data!
        }
        if (currentProduct.value?.id === id) {
          currentProduct.value = response.data!
        }
        return response.data!
      }
    )
  }

  /**
   * Supprimer un produit (Admin)
   */
  async function deleteProduct(id: string) {
    return execute(
      async () => {
        await productsAPI.delete(id)
        products.value = products.value.filter((p) => p.id !== id)
        if (currentProduct.value?.id === id) {
          currentProduct.value = null
        }
        return null
      }
    )
  }

  return {
    // État
    products,
    currentProduct,
    loading,
    error,
    pagination,
    // Actions
    fetchProducts,
    fetchProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})