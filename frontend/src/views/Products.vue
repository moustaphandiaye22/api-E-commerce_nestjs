<template>
  <div class="min-h-screen bg-(--bg-secondary)">
    <!-- Breadcrumb -->
    <div class="bg-(--bg-primary) border-b border-(--border-light)">
      <div class="container mx-auto px-4 py-4">
        <Breadcrumb :items="breadcrumbItems" />
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:col-span-1">
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-[var(--text-primary)]">Filtres</h3>
              <button
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="text-sm text-[var(--color-primary)] hover:underline"
              >
                Effacer tout
              </button>
            </div>

            <!-- Search -->
            <div class="mb-6">
              <Input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                @input="handleSearch"
              >
                <template #leading>
                  <Search class="w-4 h-4" />
                </template>
                <template #trailing v-if="searchQuery">
                  <button @click="clearSearch" class="p-1 hover:bg-(--bg-hover) rounded">
                    <X class="w-4 h-4" />
                  </button>
                </template>
              </Input>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium text-[var(--text-primary)] mb-3">Catégories</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="selectedCategories"
                    @change="applyFilters"
                    class="w-4 h-4 rounded border-(--border-medium) text-[var(--color-primary)] focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0"
                  />
                  <span class="text-sm text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-smooth">
                    {{ category.nom }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-medium text-[var(--text-primary)] mb-3">Prix</h4>
              <div class="flex items-center gap-2">
                <Input
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="Min"
                  @input="applyFilters"
                  size="sm"
                />
                <span class="text-[var(--text-muted)]">-</span>
                <Input
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="Max"
                  @input="applyFilters"
                  size="sm"
                />
              </div>
            </div>

            <!-- Availability -->
            <div class="mb-6">
              <h4 class="font-medium text-[var(--text-primary)] mb-3">Disponibilité</h4>
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  v-model="filters.inStock"
                  @change="applyFilters"
                  class="w-4 h-4 rounded border-(--border-medium) text-[var(--color-primary)] focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0"
                />
                <span class="text-sm text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-smooth">
                  En stock uniquement
                </span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-3">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl font-bold text-[var(--text-primary)]">Nos Produits</h1>
              <p v-if="!productsStore.loading" class="text-sm text-[var(--text-muted)] mt-1">
                {{ productsStore.pagination.total }} produit{{ productsStore.pagination.total > 1 ? 's' : '' }} trouvé{{ productsStore.pagination.total > 1 ? 's' : '' }}
              </p>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Sort -->
              <Select v-model="sortBy" @change="applySorting" class="flex-1 sm:flex-initial sm:w-48">
                <option value="name">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
                <option value="price">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="newest">Plus récent</option>
                <option value="rating">Meilleure note</option>
              </Select>

              <!-- View Toggle -->
              <div class="flex items-center gap-1 bg-(--bg-primary) rounded-lg border border-(--border-light) p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'p-2 rounded transition-smooth',
                    viewMode === 'grid'
                      ? 'bg-(--color-primary) text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover)'
                  ]"
                  title="Vue grille"
                >
                  <Grid3x3 class="w-4 h-4" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'p-2 rounded transition-smooth',
                    viewMode === 'list'
                      ? 'bg-(--color-primary) text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover)'
                  ]"
                  title="Vue liste"
                >
                  <List class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="productsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="animate-pulse">
              <div class="bg-(--bg-tertiary) aspect-square rounded-xl mb-4"></div>
              <div class="h-4 bg-(--bg-tertiary) rounded mb-2"></div>
              <div class="h-4 bg-(--bg-tertiary) rounded w-2/3"></div>
            </div>
          </div>

          <!-- Error State -->
          <Alert
            v-else-if="productsStore.error"
            variant="error"
            :title="'Erreur de chargement'"
            closeable
            @close="productsStore.error = null"
          >
            <p>{{ productsStore.error }}</p>
            <Button variant="outline" size="sm" class="mt-3" @click="retryLoad">
              Réessayer
            </Button>
          </Alert>

          <!-- Products Grid -->
          <div
            v-else-if="productsStore.products.length > 0"
            :class="[
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            ]"
          >
            <ProductCard
              v-for="product in productsStore.products"
              :key="product.id"
              :product="product"
              :is-in-wishlist="wishlistStore.isInWishlist(product.id)"
              :show-description="viewMode === 'list'"
              @click="goToProduct"
              @add-to-cart="addToCart"
              @toggle-wishlist="toggleWishlist"
              :class="viewMode === 'list' ? 'flex-row' : ''"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-(--bg-tertiary) flex items-center justify-center">
              <Package class="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-2">Aucun produit trouvé</h3>
            <p class="text-[var(--text-secondary)] mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
            <Button @click="clearAllFilters" variant="outline">
              Effacer les filtres
            </Button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-12">
            <Pagination
              :current-page="productsStore.pagination.page"
              :total-pages="totalPages"
              @change="goToPage"
            />
          </div>
        </main>
      </div>
    </div>

    <!-- Quick View Modal -->
    <Modal
      v-model="showQuickViewModal"
      title="Aperçu rapide"
      size="lg"
    >
      <div v-if="quickViewProduct" class="grid md:grid-cols-2 gap-6">
        <div class="aspect-square bg-(--bg-tertiary) rounded-xl overflow-hidden">
          <img
            v-if="quickViewProduct.images_produits && quickViewProduct.images_produits.length > 0"
            :src="getImageUrl(quickViewProduct.images_produits.find(img => img.est_principale)?.url_image || quickViewProduct.images_produits[0]?.url_image)"
            :alt="quickViewProduct.nom"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center w-full h-full text-[var(--text-muted)]">
            Pas d'image
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <p v-if="quickViewProduct.categorie" class="text-sm text-[var(--text-muted)] uppercase tracking-wide mb-2">
              {{ quickViewProduct.categorie.nom }}
            </p>
            <h2 class="text-2xl font-bold text-[var(--text-primary)]">{{ quickViewProduct.nom }}</h2>
          </div>

          <p class="text-3xl font-bold text-[var(--color-primary)]">
            {{ formatPrice(quickViewProduct.prix) }}
          </p>

          <p class="text-[var(--text-secondary)] line-clamp-4">
            {{ quickViewProduct.description || 'Aucune description disponible.' }}
          </p>

          <div v-if="quickViewProduct.quantite_stock > 0" class="flex items-center gap-2">
            <Badge variant="success">En stock</Badge>
            <span class="text-sm text-[var(--text-muted)]">{{ quickViewProduct.quantite_stock }} disponible(s)</span>
          </div>
          <Badge v-else variant="error">Rupture de stock</Badge>

          <div class="flex flex-col gap-3 pt-4">
            <Button
              v-if="authStore.isAuthenticated"
              @click="addToCart(quickViewProduct.id)"
              :disabled="quickViewProduct.quantite_stock <= 0"
              variant="primary"
              size="lg"
              full-width
            >
              <ShoppingCart class="w-5 h-5" />
              Ajouter au panier
            </Button>
            <Button
              v-else
              @click="redirectToLogin"
              variant="primary"
              size="lg"
              full-width
            >
              Se connecter pour acheter
            </Button>

            <Button
              @click="goToProduct({ id: quickViewProduct.id })"
              variant="outline"
              size="lg"
              full-width
            >
              Voir le détail complet
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useCategoriesStore } from '../stores/categories'
import { useAuthStore } from '../stores/auth'
import { formatPrice } from '../utils/formatters'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Input from '../components/ui/Input.vue'
import Select from '../components/ui/Select.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Alert from '../components/ui/Alert.vue'
import Modal from '../components/ui/Modal.vue'
import Pagination from '../components/ui/Pagination.vue'
import ProductCard from '../components/shared/ProductCard.vue'
import {
  Search,
  X,
  Grid3x3,
  List,
  Package,
  ShoppingCart,
} from 'lucide-vue-next'
import type { Product } from '../types/api'
import type { Product } from '../types/api'

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('name')
const selectedCategories = ref<string[]>([])
const priceRange = ref({ min: null as number | null, max: null as number | null })
const filters = ref({ inStock: false })
const quickViewProduct = ref<Product | null>(null)
const showQuickViewModal = ref(false)

let searchTimeout: NodeJS.Timeout | null = null

// Breadcrumb
const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Produits', to: '/products' },
]

// Computed
const categories = computed(() => categoriesStore.categories)

const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    priceRange.value.min !== null ||
    priceRange.value.max !== null ||
    filters.value.inStock ||
    searchQuery.value.trim() !== ''
  )
})

const totalPages = computed(() => {
  return Math.ceil(productsStore.pagination.total / productsStore.pagination.limit)
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
    limit: 12,
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
  applyFilters()
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
      inStock: filters.value.inStock || undefined,
    }
    productsStore.fetchProducts(currentFilters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToProduct = (product: any) => {
  router.push(`/products/${product.id}`)
}

const addToCart = async (productId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  try {
    await cartStore.addItem({ produit_id: productId, quantite: 1 })
    // TODO: Show toast notification
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

const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`
}

// Load initial data
onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    productsStore.fetchProducts({ page: 1, limit: 12 }),
  ])
})

// Watch for filter changes
watch([selectedCategories, priceRange, filters], () => {
  applyFilters()
}, { deep: true })

// Watch quickViewProduct to control modal
watch(quickViewProduct, (newVal) => {
  showQuickViewModal.value = !!newVal
})

watch(showQuickViewModal, (newVal) => {
  if (!newVal) {
    quickViewProduct.value = null
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
