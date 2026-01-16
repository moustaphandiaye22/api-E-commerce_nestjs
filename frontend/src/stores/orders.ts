import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ordersAPI } from '../api/orders'
import { useApi } from '../composables/useApi'
import type { Order } from '../types/api'

/**
 * Store des commandes
 * Principe: Single Responsibility - Gère uniquement les commandes
 */
export const useOrdersStore = defineStore('orders', () => {
  // État
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const { loading, error, execute } = useApi<Order[]>()

  /**
   * Récupérer toutes les commandes de l'utilisateur
   */
  async function fetchOrders() {
    return execute(
      async () => {
        const response = await ordersAPI.getAll()
        orders.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Récupérer une commande par ID
   */
  async function fetchOrderById(id: string) {
    return execute(
      async () => {
        const response = await ordersAPI.getById(id)
        currentOrder.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Créer une nouvelle commande
   */
  async function createOrder(data: { shippingAddress: any; billingAddress: any }) {
    return execute(
      async () => {
        const response = await ordersAPI.create(data)
        orders.value.unshift(response.data!)
        return response.data!
      }
    )
  }

  return {
    // État
    orders,
    currentOrder,
    loading,
    error,
    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
  }
})