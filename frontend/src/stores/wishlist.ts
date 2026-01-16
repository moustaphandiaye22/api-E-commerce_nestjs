import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { wishlistsAPI } from '../api/wishlists'
import { useApi } from '../composables/useApi'
import type { WishlistItem } from '../types/api'

/**
 * Store de la liste de souhaits
 * Principe: Single Responsibility - Gère uniquement la wishlist
 */
export const useWishlistStore = defineStore('wishlist', () => {
  // État
  const wishlist = ref<WishlistItem[]>([])
  const { loading, error, execute } = useApi<WishlistItem[]>()

  // Getters
  const itemCount = computed(() => wishlist.value.length)

  const isInWishlist = computed(() => (productId: string) => {
    return wishlist.value.some(item => item.produit_id === productId)
  })

  /**
   * Récupérer la liste de souhaits
   */
  async function fetchWishlist() {
    return execute(
      async () => {
        const response = await wishlistsAPI.get()
        wishlist.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Ajouter un produit à la liste de souhaits
   */
  async function addToWishlist(produit_id: string) {
    return execute(
      async () => {
        const response = await wishlistsAPI.add(produit_id)
        wishlist.value.push(response.data!)
        return response.data!
      }
    )
  }

  /**
   * Retirer un produit de la liste de souhaits
   */
  async function removeFromWishlist(productId: string) {
    return execute(
      async () => {
        await wishlistsAPI.remove(productId)
        wishlist.value = wishlist.value.filter(item => item.produit_id !== productId)
        return null
      }
    )
  }

  /**
   * Basculer un produit dans/de la liste de souhaits
   */
  async function toggleWishlist(productId: string) {
    if (isInWishlist.value(productId)) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId)
    }
  }

  return {
    // État
    wishlist,
    loading,
    error,
    // Getters
    itemCount,
    isInWishlist,
    // Actions
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  }
})