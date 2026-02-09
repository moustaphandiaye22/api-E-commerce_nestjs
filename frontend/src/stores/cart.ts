import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartsAPI } from '../api/carts'
import { couponsAPI } from '../api/coupons'
import { useApi } from '../composables/useApi'
import { useAuthStore } from './auth'
import type { Cart, AddToCartDto, CouponValidationResult } from '../types/api'

/**
 * Store du panier
 * Principe: Single Responsibility - Gère uniquement le panier
 */
export const useCartStore = defineStore('cart', () => {
  // État
  const cart = ref<Cart | null>(null)
  const appliedCoupon = ref<CouponValidationResult | null>(null)
  const { loading, error, execute } = useApi<Cart>()
  const router = useRouter()
  const authStore = useAuthStore()

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

  const discountAmount = computed(() => {
    if (!appliedCoupon.value) return 0
    const { discount } = appliedCoupon.value
    return discount
  })

  const finalAmount = computed(() => {
    return totalAmount.value - discountAmount.value
  })

  /**
   * Helper pour vérifier l'authentification
   */
  function requireAuth(): boolean {
    if (!authStore.isAuthenticated()) {
      // Stocker l'URL de retour pour redirection après connexion
      const currentPath = window.location.pathname
      localStorage.setItem('redirectAfterLogin', currentPath)
      router.push('/login')
      return false
    }
    return true
  }

  /**
   * Récupérer le panier
   */
  async function fetchCart() {
    if (!requireAuth()) return null
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
    if (!requireAuth()) return null
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
    if (!requireAuth()) return null
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
    if (!requireAuth()) return null
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
    if (!requireAuth()) return null
    return execute(
      async () => {
        await cartsAPI.clear()
        cart.value = null
        appliedCoupon.value = null
        return null
      }
    )
  }

  /**
   * Appliquer un coupon
   */
  async function applyCoupon(code: string) {
    if (!requireAuth()) return null
    return execute(
      async () => {
        const response = await couponsAPI.validate({
          code,
          cartTotal: totalAmount.value
        })
        appliedCoupon.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Retirer le coupon
   */
  function removeCoupon() {
    appliedCoupon.value = null
  }

  return {
    // État
    cart,
    appliedCoupon,
    loading,
    error,
    // Getters
    itemCount,
    totalAmount,
    discountAmount,
    finalAmount,
    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  }
})