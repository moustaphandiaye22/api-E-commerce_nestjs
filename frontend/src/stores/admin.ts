import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import type { Product, Category, Coupon, User, Order } from '../types/api'

/**
 * Interface pour les statistiques du dashboard admin
 */
interface AdminStats {
  products: number
  categories: number
  orders: number
  users: number
  revenue: number
}

/**
 * Store Admin pour la gestion du dashboard et des statistiques
 */
export const useAdminStore = defineStore('admin', () => {
  // État
  const stats = ref<AdminStats>({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  })
  const { loading, error, execute } = useApi<AdminStats>()

  // Getters
  function isAdmin(): boolean {
    return true // Vérifié par le guard de route
  }

  /**
   * Charger les statistiques du dashboard
   */
  async function fetchStats() {
    return execute(
      async () => {
        // Simulations de stats - à remplacer par un endpoint stats si nécessaire
        const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
          fetch('/api/products?limit=1').then(r => r.json()),
          fetch('/api/categories?limit=1').then(r => r.json()),
          fetch('/api/orders?limit=1').then(r => r.json()),
          fetch('/api/users?limit=1').then(r => r.json()),
        ])
        
        stats.value = {
          products: productsRes.data?.length || 0,
          categories: categoriesRes.data?.length || 0,
          orders: ordersRes.data?.length || 0,
          users: usersRes.data?.length || 0,
          revenue: 0, // À calculer depuis les paiements
        }
        
        return stats.value
      },
      {
        onError: () => {
          // Stats par défaut en cas d'erreur
          stats.value = { products: 0, categories: 0, orders: 0, users: 0, revenue: 0 }
        },
      }
    )
  }

  return {
    stats,
    loading,
    error,
    isAdmin,
    fetchStats,
  }
})

