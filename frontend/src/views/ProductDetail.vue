<template>
  <div class="product-detail">
    <button @click="goBack" class="back-btn">← Retour</button>

    <div v-if="productsStore.loading" class="loading">
      Chargement du produit...
    </div>

    <div v-else-if="productsStore.error" class="error-message">
      {{ productsStore.error }}
    </div>

    <div v-else-if="product" class="product-content">
      <div class="product-images">
        <img
          v-if="product.images_produits && product.images_produits.length > 0"
          :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
          :alt="product.nom"
          class="main-image"
        />
        <div v-else class="no-image">Pas d'image disponible</div>
      </div>

      <div class="product-details">
        <h1>{{ product.nom }}</h1>
        
        <p class="category" v-if="product.categorie">
          Catégorie: {{ product.categorie.nom }}
        </p>

        <p class="price">{{ formatPrice(product.prix) }} €</p>

        <div class="description">
          <h3>Description</h3>
          <p>{{ product.description || 'Pas de description disponible' }}</p>
        </div>

        <div v-if="product.variantes && product.variantes.length > 0" class="variants">
          <h3>Variantes disponibles</h3>
          <div class="variant-list">
            <div v-for="variant in product.variantes" :key="variant.id" class="variant-item">
              <span>{{ variant.nom }}</span>
              <span>+{{ formatPrice(variant.prix_supplementaire) }} €</span>
            </div>
          </div>
        </div>

        <div class="product-actions">
          <button
            @click="toggleWishlist"
            class="wishlist-btn"
            :class="{ active: isInWishlist }"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </button>

          <button
            @click="addToCart"
            class="add-to-cart-btn"
            :disabled="!product.est_actif || product.stock === 0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ product.est_actif && product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible' }}
          </button>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h3>Avis clients</h3>

          <!-- Add Review Form (for authenticated users) -->
          <div v-if="authStore.isAuthenticated" class="add-review">
            <h4>Donner votre avis</h4>
            <form @submit.prevent="submitReview" class="review-form">
              <div class="rating-input">
                <label>Note:</label>
                <div class="stars">
                  <span
                    v-for="star in 5"
                    :key="star"
                    @click="newReview.note = star"
                    :class="{ active: star <= newReview.note }"
                    class="star"
                  >
                    ★
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label for="review-title">Titre (optionnel):</label>
                <input
                  id="review-title"
                  v-model="newReview.titre"
                  type="text"
                  placeholder="Titre de votre avis"
                />
              </div>
              <div class="form-group">
                <label for="review-comment">Commentaire:</label>
                <textarea
                  id="review-comment"
                  v-model="newReview.commentaire"
                  placeholder="Partagez votre expérience..."
                  required
                ></textarea>
              </div>
              <button type="submit" :disabled="reviewsStore.loading" class="btn-submit">
                Publier l'avis
              </button>
            </form>
          </div>

          <!-- Reviews List -->
          <div v-if="reviewsStore.loading" class="loading">
            Chargement des avis...
          </div>

          <div v-else-if="reviewsStore.error" class="error-message">
            {{ reviewsStore.error }}
          </div>

          <div v-else-if="reviewsStore.reviews.length > 0" class="reviews-list">
            <div
              v-for="review in reviewsStore.reviews"
              :key="review.id"
              class="review-item"
            >
              <div class="review-header">
                <div class="review-author">
                  <strong>{{ review.utilisateur?.prenom }} {{ review.utilisateur?.nom }}</strong>
                  <span v-if="review.est_verifie" class="verified-badge">✓ Vérifié</span>
                </div>
                <div class="review-rating">
                  <div class="stars">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="{ active: star <= review.note }"
                      class="star"
                    >
                      ★
                    </span>
                  </div>
                  <span class="review-date">{{ formatDate(review.cree_le) }}</span>
                </div>
              </div>
              <div v-if="review.titre" class="review-title">
                {{ review.titre }}
              </div>
              <div class="review-comment">
                {{ review.commentaire }}
              </div>
            </div>
          </div>

          <div v-else class="no-reviews">
            <p>Soyez le premier à donner votre avis sur ce produit !</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useReviewsStore } from '../stores/reviews'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { formatPrice } from '../utils/formatters'

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const reviewsStore = useReviewsStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const product = computed(() => productsStore.currentProduct)
const isInWishlist = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false
})

// New review form data
const newReview = ref({
  note: 5,
  titre: '',
  commentaire: ''
})

onMounted(async () => {
  const productId = route.params.id as string

  // Parallel API calls for better performance
  await Promise.all([
    productsStore.fetchProductById(productId),
    reviewsStore.fetchReviewsByProduct(productId)
  ])
})

const goBack = () => {
  router.back()
}

const addToCart = async () => {
  if (product.value) {
    await cartStore.addItem({ produit_id: product.value.id, quantite: 1 })
  }
}

const toggleWishlist = async () => {
  if (product.value) {
    await wishlistStore.toggleWishlist(product.value.id)
  }
}

const submitReview = async () => {
  if (!product.value) return

  try {
    await reviewsStore.createReview({
      produit_id: product.value.id,
      note: newReview.value.note,
      titre: newReview.value.titre || undefined,
      commentaire: newReview.value.commentaire
    })

    // Reset form
    newReview.value = { note: 5, titre: '', commentaire: '' }
  } catch (error) {
    console.error('Error submitting review:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}
</script>

<style scoped>
@import '../styles/design-system.css';

.product-detail {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: var(--spacing-8) var(--container-padding);
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.back-btn:hover {
  background-color: var(--color-bg-hover);
}

.loading, .error-message {
  text-align: center;
  padding: var(--spacing-12);
  font-size: var(--font-size-lg);
}

.error-message {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-6);
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-12);
}

.product-images {
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  box-shadow: var(--shadow-sm);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.no-image {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.product-details h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.category {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-4);
}

.price {
  font-size: var(--font-size-4xl);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-6);
}

.description, .variants {
  margin-bottom: var(--spacing-8);
}

.description h3, .variants h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
}

.description p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.variant-list {
  display: grid;
  gap: var(--spacing-2);
}

.variant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  border: var(--border-width) solid var(--color-border-light);
}

.product-actions {
  display: grid;
  gap: var(--spacing-3);
  margin-top: var(--spacing-8);
}

.wishlist-btn, .add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border: var(--border-width) solid var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.wishlist-btn:hover, .add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.wishlist-btn.active {
  background-color: var(--color-error);
  border-color: var(--color-error);
}

.wishlist-btn.active:hover {
  background-color: var(--color-error);
  opacity: 0.9;
}

.wishlist-btn {
  background-color: transparent;
  color: var(--color-primary);
}

.wishlist-btn:hover {
  background-color: var(--color-primary-lighter);
}

.wishlist-btn.active {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wishlist-btn svg, .add-to-cart-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* === REVIEWS SECTION === */
.reviews-section {
  margin-top: var(--spacing-12);
  padding-top: var(--spacing-8);
  border-top: var(--border-width) solid var(--color-border-light);
}

.reviews-section h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
}

.add-review {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-8);
}

.add-review h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.review-form {
  display: grid;
  gap: var(--spacing-4);
}

.rating-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.rating-input label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.stars {
  display: flex;
  gap: var(--spacing-1);
}

.star {
  font-size: var(--font-size-xl);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.star.active {
  color: var(--color-warning);
}

.star:hover {
  color: var(--color-warning);
}

.form-group {
  display: grid;
  gap: var(--spacing-2);
}

.form-group label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-group input,
.form-group textarea {
  padding: var(--spacing-3);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.btn-submit {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  justify-self: start;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reviews-list {
  display: grid;
  gap: var(--spacing-6);
}

.review-item {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-3);
}

.review-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.verified-badge {
  background-color: var(--color-success-light);
  color: var(--color-success);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.review-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-1);
}

.review-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.review-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.review-comment {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.no-reviews {
  text-align: center;
  padding: var(--spacing-8);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }

  .product-actions {
    grid-template-columns: 1fr;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .review-rating {
    align-items: flex-start;
  }
}
</style>