import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartsAPI } from '../api/carts'
import { useApi } from '../composables/useApi'
import type { Cart, CartItem, AddToCartDto } from '../types/api'

/**
 * Store du panier
 * Principe: Single Responsibility - Gère uniquement le panier
 */
export const useCartStore = defineStore('cart', () => {
  // État
  const cart = ref<Cart | null>(null)
  const { loading, error, execute } = useApi<Cart>()

  // Getters
  const itemCount = computed(() => {
    if (!cart.value) return 0
    return cart.value.articles_panier.reduce((total, item) => total + item.quantite, 0)
  })

  const totalAmount = computed(() => {
    if (!cart.value) return 0
    return cart.value.articles_panier.reduce((total, item) => {
      return total + (parseFloat(item.prix_unitaire) * item.quantite)
    }, 0)
  })

  /**
   * Récupérer le panier
   */
  async function fetchCart() {
    return execute(
      async () => {
        const response = await cartsAPI.get()
        cart.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Ajouter un article au panier
   */
  async function addItem(item: AddToCartDto) {
    return execute(
      async () => {
        const response = await cartsAPI.addItem(item)
        cart.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Mettre à jour la quantité d'un article
   */
  async function updateItem(itemId: string, quantity: number) {
    return execute(
      async () => {
        const response = await cartsAPI.updateItem(itemId, quantity)
        cart.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Supprimer un article du panier
   */
  async function removeItem(itemId: string) {
    return execute(
      async () => {
        await cartsAPI.removeItem(itemId)
        if (cart.value) {
          cart.value.articles_panier = cart.value.articles_panier.filter(item => item.id !== itemId)
        }
        return null
      }
    )
  }

  /**
   * Vider le panier
   */
  async function clearCart() {
    return execute(
      async () => {
        await cartsAPI.clear()
        cart.value = null
        return null
      }
    )
  }

  return {
    // État
    cart,
    loading,
    error,
    // Getters
    itemCount,
    totalAmount,
    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }
})