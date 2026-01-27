<template>
  <div class="products-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">Accueil</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Produits</span>
    </nav>

    <div class="products-container">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <div class="filters-header">
          <h3>Filtres</h3>
          <button @click="clearFilters" class="clear-filters-btn" v-if="hasActiveFilters">
            Effacer tout
          </button>
        </div>

        <!-- Categories -->
        <div class="filter-group">
          <h4>Catégories</h4>
          <div class="filter-options">
            <label v-for="category in categories" :key="category.id" class="filter-option">
              <input
                type="checkbox"
                :value="category.id"
                v-model="selectedCategories"
                @change="applyFilters"
              />
              <span>{{ category.nom }}</span>
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div class="filter-group">
          <h4>Prix</h4>
          <div class="price-range">
            <div class="price-inputs">
              <input
                type="number"
                v-model.number="priceRange.min"
                placeholder="Min"
                @input="applyFilters"
                class="price-input"
              />
              <span class="price-separator">€</span>
              <input
                type="number"
                v-model.number="priceRange.max"
                placeholder="Max"
                @input="applyFilters"
                class="price-input"
              />
              <span class="price-separator">€</span>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="filter-group">
          <h4>Disponibilité</h4>
          <div class="filter-options">
            <label class="filter-option">
              <input
                type="checkbox"
                v-model="filters.inStock"
                @change="applyFilters"
              />
              <span>En stock</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="products-main">
        <!-- Header with search and controls -->
        <div class="products-header">
          <div class="search-section">
            <div class="search-bar">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher des produits..."
                @input="handleSearch"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="controls-section">
            <!-- Sort -->
            <div class="sort-dropdown">
              <select v-model="sortBy" @change="applySorting">
                <option value="name">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
                <option value="price">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="newest">Plus récent</option>
                <option value="rating">Meilleure note</option>
              </select>
            </div>

            <!-- View Toggle -->
            <div class="view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="{ active: viewMode === 'grid' }"
                class="view-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="{ active: viewMode === 'list' }"
                class="view-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Results info -->
        <div class="results-info">
          <p v-if="!productsStore.loading">
            {{ productsStore.pagination.total }} produit{{ productsStore.pagination.total > 1 ? 's' : '' }} trouvé{{ productsStore.pagination.total > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="productsStore.loading" class="loading">
          <div class="skeleton-grid">
            <div v-for="n in 8" :key="n" class="skeleton-card">
              <div class="skeleton-image"></div>
              <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-price"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="productsStore.error" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p>{{ productsStore.error }}</p>
          <Button @click="retryLoad" variant="outline" size="sm">Réessayer</Button>
        </div>

        <!-- Products Grid/List -->
        <div v-else-if="productsStore.products.length > 0" :class="['products-display', `products-${viewMode}`]">
          <div
            v-for="product in productsStore.products"
            :key="product.id"
            :class="['product-card', { 'product-list-item': viewMode === 'list' }]"
            @click="goToProduct(product.id)"
          >
            <!-- Product Badges -->
            <div class="product-badges">
              <span v-if="isNewProduct(product)" class="badge badge-new">Nouveau</span>
              <span v-if="hasDiscount(product)" class="badge badge-sale">Promo</span>
              <span v-if="product.stock === 0" class="badge badge-out">Épuisé</span>
            </div>

            <!-- Product Image -->
            <div class="product-image">
              <img
                v-if="product.images_produits && product.images_produits.length > 0"
                :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
                :alt="product.nom"
                loading="lazy"
              />
              <div v-else class="no-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Quick actions overlay -->
              <div class="product-overlay">
                <button
                  v-if="authStore.isAuthenticated"
                  @click.stop="toggleWishlist(product.id)"
                  class="overlay-btn wishlist-btn"
                  :class="{ active: isInWishlist(product.id) }"
                  title="Ajouter aux favoris"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  v-else
                  @click.stop="redirectToLogin"
                  class="overlay-btn wishlist-btn"
                  title="Connectez-vous pour ajouter aux favoris"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  @click.stop="showQuickView(product)"
                  class="overlay-btn quick-view-btn"
                  title="Aperçu rapide"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="product-info">
              <div class="product-category" v-if="product.categorie">
                {{ product.categorie.nom }}
              </div>

              <h3 class="product-title">{{ product.nom }}</h3>

              <!-- Rating -->
              <div class="product-rating" v-if="product.avis && product.avis.length > 0">
                <div class="stars">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    :class="{ filled: star <= averageRating(product) }"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span class="rating-count">({{ product.avis.length }})</span>
              </div>

              <!-- Price -->
              <div class="product-price">
                <span class="current-price">{{ formatPrice(product.prix) }} €</span>
                <span v-if="hasDiscount(product)" class="original-price">
                  {{ formatPrice(getOriginalPrice(product)) }} €
                </span>
              </div>

              <!-- Stock status -->
              <div class="product-stock" v-if="product.stock <= 5 && product.stock > 0">
                Plus que {{ product.stock }} en stock
              </div>

              <!-- Add to cart (for both grid and list view) -->
              <div class="product-actions">
                <Button
                  v-if="authStore.isAuthenticated"
                  @click.stop="addToCart(product.id)"
                  :disabled="!product.est_actif || product.stock === 0"
                  size="sm"
                  :variant="product.stock === 0 ? 'outline' : 'primary'"
                >
                  {{ product.stock === 0 ? 'Épuisé' : 'Ajouter au panier' }}
                </Button>
                <Button
                  v-else
                  @click.stop="redirectToLogin"
                  size="sm"
                  variant="primary"
                >
                  Se connecter pour acheter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- No products -->
        <div v-else class="no-products">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 003.586 13H4" />
          </svg>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos filtres ou votre recherche.</p>
          <Button @click="clearAllFilters" variant="outline">Effacer les filtres</Button>
        </div>

        <!-- Pagination -->
        <div v-if="productsStore.pagination.total > productsStore.pagination.limit" class="pagination">
          <button
            @click="goToPage(productsStore.pagination.page - 1)"
            :disabled="productsStore.pagination.page <= 1"
            class="pagination-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>

          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="{ active: page === productsStore.pagination.page }"
              class="pagination-number"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(productsStore.pagination.page + 1)"
            :disabled="productsStore.pagination.page >= totalPages"
            class="pagination-btn"
          >
            Suivant
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>

    <!-- Quick View Modal -->
    <div v-if="quickViewProduct" class="modal-overlay" @click="closeQuickView">
      <div class="modal-content" @click.stop>
        <button @click="closeQuickView" class="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="quick-view">
          <div class="quick-view-image">
            <img
              v-if="quickViewProduct.images_produits && quickViewProduct.images_produits.length > 0"
              :src="getImageUrl(quickViewProduct.images_produits.find(img => img.est_principale)?.url_image || quickViewProduct.images_produits[0]?.url_image)"
              :alt="quickViewProduct.nom"
            />
            <div v-else class="no-image">Pas d'image</div>
          </div>

          <div class="quick-view-info">
            <h2>{{ quickViewProduct.nom }}</h2>
            <p class="quick-view-price">{{ formatPrice(quickViewProduct.prix) }} €</p>
            <p class="quick-view-description">{{ quickViewProduct.description || 'Aucune description disponible.' }}</p>

            <div class="quick-view-actions">
              <Button
                v-if="authStore.isAuthenticated"
                @click="addToCart(quickViewProduct.id)"
                variant="primary"
                fullWidth
              >
                Ajouter au panier
              </Button>
              <Button
                v-else
                @click="redirectToLogin"
                variant="primary"
                fullWidth
              >
                Se connecter pour acheter
              </Button>
              <Button @click="goToProduct(quickViewProduct.id)" variant="outline" fullWidth>
                Voir le détail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useCategoriesStore } from '../stores/categories'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { formatPrice } from '../utils/formatters'
import Button from '../components/ui/Button.vue'
import type { Product } from '../types/api'

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('name')
const selectedCategories = ref<string[]>([])
const priceRange = ref({ min: null as number | null, max: null as number | null })
const filters = ref({
  inStock: false
})
const quickViewProduct = ref<Product | null>(null)

// Computed categories from store
const categories = computed(() => categoriesStore.categories)

let searchTimeout: NodeJS.Timeout | null = null

// Computed
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
         priceRange.value.min !== null ||
         priceRange.value.max !== null ||
         filters.value.inStock ||
         searchQuery.value.trim() !== ''
})

const totalPages = computed(() => {
  return Math.ceil(productsStore.pagination.total / productsStore.pagination.limit)
})

const visiblePages = computed(() => {
  const current = productsStore.pagination.page
  const total = totalPages.value
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 4) pages.push(-1) // ellipsis

    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 3) pages.push(-1) // ellipsis
    pages.push(total)
  }

  return pages
})

// Methods
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

const applyFilters = () => {
  const filterParams: any = {
    page: 1,
    limit: 12
  }

  if (searchQuery.value.trim()) {
    filterParams.search = searchQuery.value.trim()
  }

  if (selectedCategories.value.length > 0) {
    filterParams.category = selectedCategories.value.join(',')
  }

  if (priceRange.value.min !== null) {
    filterParams.minPrice = priceRange.value.min
  }

  if (priceRange.value.max !== null) {
    filterParams.maxPrice = priceRange.value.max
  }

  if (sortBy.value && sortBy.value !== 'name') {
    filterParams.sortBy = sortBy.value
  }

  if (filters.value.inStock) {
    filterParams.inStock = true
  }

  productsStore.fetchProducts(filterParams)
}

const applySorting = () => {
  // For now, sorting is handled on frontend since backend doesn't support it yet
  // In a real app, this would be sent to the API
  console.log('Sorting by:', sortBy.value)
}

const clearFilters = () => {
  selectedCategories.value = []
  priceRange.value = { min: null, max: null }
  filters.value.inStock = false
  searchQuery.value = ''
  applyFilters()
}

const clearAllFilters = () => {
  clearFilters()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    const currentFilters = {
      page,
      limit: productsStore.pagination.limit,
      search: searchQuery.value.trim() || undefined,
      category: selectedCategories.value.join(',') || undefined,
      minPrice: priceRange.value.min || undefined,
      maxPrice: priceRange.value.max || undefined,
      inStock: filters.value.inStock || undefined
    }
    productsStore.fetchProducts(currentFilters)
  }
}

const goToProduct = (id: string) => {
  router.push(`/products/${id}`)
}

const addToCart = async (productId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  try {
    await cartStore.addItem({ produit_id: productId, quantite: 1 })
    // Could show a toast notification here
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const toggleWishlist = async (productId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  try {
    await wishlistStore.toggleWishlist(productId)
  } catch (error) {
    console.error('Error toggling wishlist:', error)
  }
}

const redirectToLogin = () => {
  router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
}

const isInWishlist = (productId: string) => {
  return wishlistStore.isInWishlist(productId)
}

const isNewProduct = (_product: Product) => {
  // For now, randomly mark some products as new (in real app, check created date)
  return Math.random() > 0.8 // 20% chance of being "new"
}

const hasDiscount = (_product: Product) => {
  // For now, assume no discounts. In real app, check for discount field
  return false
}

const getOriginalPrice = (product: Product) => {
  // Return original price if there's a discount
  return product.prix
}

const averageRating = (product: Product) => {
  if (!product.avis || product.avis.length === 0) return 0
  const total = product.avis.reduce((sum, review) => sum + review.note, 0)
  return Math.round(total / product.avis.length)
}

const showQuickView = (product: Product) => {
  quickViewProduct.value = product
}

const closeQuickView = () => {
  quickViewProduct.value = null
}

const retryLoad = () => {
  applyFilters()
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}

// Load initial data
onMounted(async () => {
  // Load categories and products in parallel
  await Promise.all([
    categoriesStore.fetchCategories(),
    productsStore.fetchProducts({ page: 1, limit: 12 })
  ])
})

// Watch for filter changes
watch([selectedCategories, priceRange, filters], () => {
  applyFilters()
}, { deep: true })
</script>

<style scoped>
@import '../styles/design-system.css';

/* === BREADCRUMB === */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-sm);
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--color-text-tertiary);
}

.breadcrumb-current {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* === MAIN LAYOUT === */
.products-page {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: var(--spacing-6) var(--container-padding);
}

.products-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-8);
}

/* === FILTERS SIDEBAR === */
.filters-sidebar {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  height: fit-content;
  position: sticky;
  top: var(--spacing-6);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.filters-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.clear-filters-btn:hover {
  color: var(--color-primary-dark);
}

.filter-group {
  margin-bottom: var(--spacing-6);
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.filter-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.filter-option input[type="checkbox"] {
  margin: 0;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.price-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.price-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-lighter);
}

.price-separator {
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
}

/* === MAIN CONTENT === */
.products-main {
  min-height: 600px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  gap: var(--spacing-4);
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar .search-icon {
  position: absolute;
  left: var(--spacing-3);
  width: 18px;
  height: 18px;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-bar input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-10);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-lighter);
}

.clear-search-btn {
  position: absolute;
  right: var(--spacing-3);
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.clear-search-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-hover);
}

.controls-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.sort-dropdown select {
  padding: var(--spacing-2) var(--spacing-3);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background-color: var(--color-bg-primary);
  cursor: pointer;
}

.sort-dropdown select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.view-toggle {
  display: flex;
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.view-btn {
  background: none;
  border: none;
  padding: var(--spacing-2);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.view-btn:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.view-btn.active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

.results-info {
  margin-bottom: var(--spacing-6);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* === LOADING & ERROR === */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-6);
  width: 100%;
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

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--border-radius-lg);
  text-align: center;
}

.error-message svg {
  width: 48px;
  height: 48px;
}

/* === PRODUCTS DISPLAY === */
.products-display {
  margin-bottom: var(--spacing-8);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.product-list-item {
  display: flex;
  gap: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}

.product-list-item:hover {
  box-shadow: var(--shadow-md);
}

.product-list-item .product-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.product-list-item .product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* === PRODUCT CARD === */
.product-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* Product Badges */
.product-badges {
  position: absolute;
  top: var(--spacing-3);
  left: var(--spacing-3);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-new {
  background-color: var(--color-success);
  color: white;
}

.badge-sale {
  background-color: var(--color-error);
  color: white;
}

.badge-out {
  background-color: var(--color-text-tertiary);
  color: white;
}

/* Product Image */
.product-image {
  width: 100%;
  height: 200px;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

/* Product Overlay */
.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--border-radius-full);
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}

.overlay-btn:hover {
  transform: scale(1.1);
}

.wishlist-btn.active {
  background-color: var(--color-error);
  color: white;
}

.overlay-btn svg {
  width: 18px;
  height: 18px;
}

/* Product Info */
.product-info {
  padding: var(--spacing-4);
}

.product-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-1);
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

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.stars {
  display: flex;
  gap: 2px;
}

.stars svg {
  width: 14px;
  height: 14px;
  color: var(--color-warning);
}

.stars svg.filled {
  fill: currentColor;
}

.rating-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.product-price {
  margin-bottom: var(--spacing-2);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  text-decoration: line-through;
  margin-left: var(--spacing-2);
}

.product-stock {
  font-size: var(--font-size-xs);
  color: var(--color-warning);
  font-weight: var(--font-weight-medium);
}

.product-actions {
  margin-top: var(--spacing-3);
}

/* === NO PRODUCTS === */
.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-16) var(--spacing-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.no-products svg {
  width: 64px;
  height: 64px;
  color: var(--color-text-tertiary);
}

.no-products h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
}

/* === PAGINATION === */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-8);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-bg-primary);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: var(--spacing-1);
}

.pagination-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--color-bg-primary);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.pagination-number:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-number.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* === MODAL === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.modal-close {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
  z-index: 1;
}

.modal-close:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.quick-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
  padding: var(--spacing-6);
}

.quick-view-image {
  width: 100%;
  height: 300px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-view-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-view-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.quick-view h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.quick-view-price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.quick-view-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  flex: 1;
}

.quick-view-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .products-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .filters-sidebar {
    position: static;
    order: 2;
  }

  .products-main {
    order: 1;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .products-page {
    padding: var(--spacing-4) var(--container-padding);
  }

  .products-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-4);
  }

  .search-section {
    max-width: none;
  }

  .controls-section {
    justify-content: space-between;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .product-list-item {
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .product-list-item .product-image {
    width: 100%;
    height: 200px;
  }

  .quick-view {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .quick-view-image {
    height: 250px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .pagination-btn {
    padding: var(--spacing-2) var(--spacing-3);
  }

  .view-toggle {
    order: 1;
  }

  .sort-dropdown {
    order: 2;
  }

  .product-badges {
    flex-direction: row;
    gap: var(--spacing-2);
  }

  .badge {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>