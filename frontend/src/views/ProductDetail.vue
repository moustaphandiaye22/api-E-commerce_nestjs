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
          :src="product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useRouter, useRoute } from 'vue-router'
import { formatPrice } from '../utils/formatters'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const router = useRouter()
const route = useRoute()

const product = computed(() => productsStore.currentProduct)
const isInWishlist = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false
})

onMounted(() => {
  const productId = route.params.id as string
  productsStore.fetchProductById(productId)
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
  min-height: 400px;
  box-shadow: var(--shadow-sm);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }

  .product-actions {
    grid-template-columns: 1fr;
  }
}
</style>