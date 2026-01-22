<template>
  <div class="wishlist-page">
    <div class="container">
      <h1>Ma Liste de Souhaits</h1>

      <!-- Loading State -->
      <div v-if="wishlistStore.loading" class="loading">
        Chargement de la liste de souhaits...
      </div>

      <!-- Error State -->
      <div v-else-if="wishlistStore.error" class="error-message">
        {{ wishlistStore.error }}
        <button @click="wishlistStore.fetchWishlist()" class="btn-retry">
          Réessayer
        </button>
      </div>

      <!-- Empty Wishlist -->
      <div v-else-if="wishlistStore.wishlist.length === 0" class="empty-wishlist">
        <div class="empty-wishlist-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2>Votre liste de souhaits est vide</h2>
        <p>Découvrez nos produits et ajoutez-les à votre liste de souhaits</p>
        <router-link to="/products" class="btn-primary">
          Voir les produits
        </router-link>
      </div>

      <!-- Wishlist Items -->
      <div v-else class="wishlist-content">
        <div class="wishlist-grid">
          <div
            v-for="item in wishlistStore.wishlist"
            :key="item.id"
            class="wishlist-item"
          >
            <div class="item-image">
              <img
                v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                :alt="item.produit.nom"
              />
              <div v-else class="no-image">Pas d'image</div>
            </div>

            <div class="item-details">
              <h3 class="item-title">{{ item.produit.nom }}</h3>
              <p class="item-price">{{ formatPrice(item.produit.prix) }} €</p>
              <div class="item-category" v-if="item.produit.categorie">
                {{ item.produit.categorie.nom }}
              </div>
              <div class="item-stock" :class="{ 'out-of-stock': !item.produit.est_actif || item.produit.stock === 0 }">
                {{ item.produit.est_actif && item.produit.stock > 0 ? `${item.produit.stock} en stock` : 'Rupture de stock' }}
              </div>
            </div>

            <div class="item-actions">
              <button
                v-if="item.produit.est_actif && item.produit.stock > 0"
                @click="addToCart(item.produit.id)"
                class="btn-add-cart"
                :disabled="cartStore.loading"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ajouter au panier
              </button>

              <button
                @click="goToProduct(item.produit.id)"
                class="btn-view-product"
              >
                Voir le produit
              </button>

              <button
                @click="removeFromWishlist(item.produit.id)"
                class="btn-remove"
                title="Retirer de la liste de souhaits"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/wishlist'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  wishlistStore.fetchWishlist()
})

const addToCart = async (productId: string) => {
  await cartStore.addItem({ produit_id: productId, quantite: 1 })
}

const goToProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const removeFromWishlist = async (productId: string) => {
  await wishlistStore.removeFromWishlist(productId)
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}
</script>

<style scoped>
@import '../styles/design-system.css';

.wishlist-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-4) 0;
}

.container {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.wishlist-page h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-8);
  text-align: center;
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

.btn-retry {
  margin-top: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-fast);
}

.btn-retry:hover {
  background-color: var(--color-primary-dark);
}

.empty-wishlist {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
}

.empty-wishlist-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-6);
  color: var(--color-text-tertiary);
}

.empty-wishlist-icon svg {
  width: 100%;
  height: 100%;
}

.empty-wishlist h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.empty-wishlist p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-6);
}

.btn-primary {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.wishlist-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.wishlist-item {
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  position: relative;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.wishlist-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.item-image {
  width: 100%;
  height: 200px;
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.item-details {
  margin-bottom: var(--spacing-4);
}

.item-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-1);
}

.item-category {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-1);
}

.item-stock {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.item-stock.out-of-stock {
  color: var(--color-error);
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.btn-add-cart, .btn-view-product {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border: var(--border-width) solid var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-add-cart:hover:not(:disabled), .btn-view-product:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-add-cart:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-view-product {
  background-color: transparent;
  color: var(--color-primary);
}

.btn-view-product:hover {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.btn-remove {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  width: 32px;
  height: 32px;
  border: none;
  background-color: var(--color-error);
  color: var(--color-text-inverse);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.btn-remove:hover {
  background-color: var(--color-error);
  opacity: 0.9;
}

.btn-remove svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>