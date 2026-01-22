<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Bienvenue sur Baobab Market</h1>
      <p>Découvrez notre sélection de produits de qualité</p>
      <router-link to="/products" class="btn btn-primary">Voir tous les produits</router-link>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Produits populaires</h2>

      <div v-if="productsStore.loading" class="loading">
        <div class="skeleton-grid">
          <div v-for="n in 4" :key="n" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-price"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="productsStore.error" class="error-message">
        <p>{{ productsStore.error }}</p>
        <button @click="loadProducts" class="btn btn-outline">Réessayer</button>
      </div>

      <div v-else-if="featuredProducts.length > 0" class="products-grid">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-card"
          @click="goToProduct(product.id)"
        >
          <!-- Product Image -->
          <div class="product-image">
            <img
              v-if="product.images_produits && product.images_produits.length > 0"
              :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
              :alt="product.nom"
              loading="lazy"
              :srcset="getImageSrcSet(product)"
              sizes="(max-width: 768px) 250px, 280px"
            />
            <div v-else class="no-image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h3 class="product-title">{{ product.nom }}</h3>
            <p class="product-price">{{ formatPrice(product.prix) }} €</p>
            <button @click.stop="addToCart(product.id)" class="btn btn-small">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-products">
        <p>Aucun produit disponible pour le moment.</p>
      </div>
    </section>

    <!-- User Actions -->
    <section class="user-actions" v-if="!authStore.isAuthenticated">
      <div class="action-cards">
        <div class="action-card">
          <h3>Créer un compte</h3>
          <p>Profitez d'avantages exclusifs</p>
          <router-link to="/register" class="btn btn-outline">S'inscrire</router-link>
        </div>
        <div class="action-card">
          <h3>Se connecter</h3>
          <p>Accédez à votre compte</p>
          <router-link to="/login" class="btn btn-outline">Se connecter</router-link>
        </div>
      </div>
    </section>

    <section class="user-actions" v-else>
      <div class="welcome-user">
        <h3>Bonjour {{ authStore.user?.prenom }} !</h3>
        <div class="user-links">
          <router-link to="/profile" class="btn btn-outline">Mon profil</router-link>
          <router-link to="/orders" class="btn btn-outline">Mes commandes</router-link>
          <button @click="handleLogout" class="btn btn-danger">Déconnexion</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { formatPrice } from '../utils/formatters'
import type { Product } from '../types/api'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const router = useRouter()

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Reactive data
const featuredProducts = ref<Product[]>([])

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Methods
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const loadProducts = async () => {
  // Use cached data if available, otherwise fetch
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts({ page: 1, limit: 8 })
  }
  featuredProducts.value = productsStore.products.slice(0, 4)
}

const goToProduct = (id: string) => {
  router.push(`/products/${id}`)
}

const addToCart = async (productId: string) => {
  try {
    await cartStore.addItem({ produit_id: productId, quantite: 1 })
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}

const getImageSrcSet = (product: any) => {
  // For now, return single image. In production, you'd have multiple sizes
  const imageUrl = getImageUrl(product.images_produits?.find((img: any) => img.est_principale)?.url_image || product.images_produits?.[0]?.url_image)
  return imageUrl ? `${imageUrl} 280w` : ''
}

// Load data on mount
onMounted(async () => {
  await loadProducts()
})
</script>

<style scoped>
@import '../styles/design-system.css';

.home {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* === HERO SECTION === */
.hero {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
  background: linear-gradient(135deg, var(--color-primary-lighter) 0%, var(--color-primary) 100%);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-12);
  color: white;
}

.hero h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero p {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-8);
  opacity: 0.9;
}

.hero .btn {
  background-color: white;
  color: var(--color-primary);
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.hero .btn:hover {
  background-color: var(--color-bg-primary);
  transform: translateY(-2px);
}

/* === FEATURED PRODUCTS === */
.featured-products {
  margin-bottom: var(--spacing-12);
}

.featured-products h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.product-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-image {
  width: 100%;
  height: 200px;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-fast);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-image .no-image {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.product-image .no-image svg {
  width: 48px;
  height: 48px;
}

.product-info {
  padding: var(--spacing-4);
}

.product-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-3);
}

.btn-small {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

/* === USER ACTIONS === */
.user-actions {
  margin-bottom: var(--spacing-8);
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.action-card {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.action-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.action-card p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-4);
}

.welcome-user {
  text-align: center;
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.welcome-user h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.user-links {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  flex-wrap: wrap;
}

/* === LOADING & ERROR === */
.loading, .error-message {
  text-align: center;
  padding: var(--spacing-12);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.skeleton-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background-color: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

.skeleton-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: var(--spacing-4);
}

.skeleton-title {
  height: 20px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-2);
  position: relative;
  overflow: hidden;
}

.skeleton-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

.skeleton-price {
  height: 24px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  width: 60%;
  position: relative;
  overflow: hidden;
}

.skeleton-price::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.no-products {
  text-align: center;
  padding: var(--spacing-12);
  color: var(--color-text-secondary);
}

/* === BUTTONS === */
.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.btn:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-danger {
  background-color: var(--color-error);
  color: white;
}

.btn-danger:hover {
  background-color: var(--color-error);
  opacity: 0.9;
}

.btn-small {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-8) var(--spacing-4);
  }

  .hero h1 {
    font-size: var(--font-size-4xl);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-4);
  }

  .action-cards {
    grid-template-columns: 1fr;
  }

  .user-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>