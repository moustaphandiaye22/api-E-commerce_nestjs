import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reviewsAPI } from '../api/reviews'
import { useApi } from '../composables/useApi'
import type { Review } from '../types/api'

/**
 * Store des avis
 * Principe: Single Responsibility - Gère uniquement les avis
 */
export const useReviewsStore = defineStore('reviews', () => {
  // État
  const reviews = ref<Review[]>([])
  const { loading, error, execute } = useApi<Review[]>()

  /**
   * Récupérer les avis d'un produit
   */
  async function fetchReviewsByProduct(productId: string) {
    return execute(
      async () => {
        const response = await reviewsAPI.getByProduct(productId)
        reviews.value = response.data!
        return response.data!
      }
    )
  }

  /**
   * Créer un avis
   */
  async function createReview(reviewData: {
    produit_id: string
    note: number
    titre?: string
    commentaire?: string
    commande_id?: string
  }) {
    return execute(
      async () => {
        const response = await reviewsAPI.create(reviewData)
        reviews.value.unshift(response.data!)
        return response.data!
      }
    )
  }

  /**
   * Mettre à jour un avis
   */
  async function updateReview(
    id: string,
    reviewData: { note?: number; titre?: string; commentaire?: string }
  ) {
    return execute(
      async () => {
        const response = await reviewsAPI.update(id, reviewData)
        const index = reviews.value.findIndex((review) => review.id === id)
        if (index !== -1) {
          reviews.value[index] = response.data!
        }
        return response.data!
      }
    )
  }

  /**
   * Vider les avis (pour changer de produit)
   */
  function clearReviews() {
    reviews.value = []
  }

  return {
    // État
    reviews,
    loading,
    error,
    // Actions
    fetchReviewsByProduct,
    createReview,
    updateReview,
    clearReviews,
  }
})