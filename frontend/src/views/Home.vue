<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div class="container mx-auto px-4 py-16 md:py-24 relative">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-primary-100) text-(--color-primary-800) text-sm font-medium mb-4">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Découvrez nos nouveautés</span>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-(--text-primary) leading-tight">
            Bienvenue sur
            <span class="gradient-text">Baobab Market</span>
          </h1>
          
          <p class="text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto">
            Découvrez notre sélection de produits africains authentiques. 
            Qualité premium, livraison rapide et paiement sécurisé.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              class="group"
              @click="$router.push('/products')"
            >
              <span>Explorer les produits</span>
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              @click="scrollToFeatures"
            >
              <span>En savoir plus</span>
            </Button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div class="space-y-2">
              <p class="text-3xl md:text-4xl font-bold text-(--color-primary)">500+</p>
              <p class="text-sm text-(--text-muted)">Produits</p>
            </div>
            <div class="space-y-2">
              <p class="text-3xl md:text-4xl font-bold text-(--color-primary)">5000+</p>
              <p class="text-sm text-(--text-muted)">Clients</p>
            </div>
            <div class="space-y-2">
              <p class="text-3xl md:text-4xl font-bold text-(--color-primary)">98%</p>
              <p class="text-sm text-(--text-muted)">Satisfaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section ref="featuresSection" class="py-16 md:py-24 bg-(--bg-primary)">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-(--text-primary) mb-3">
              Produits populaires
            </h2>
            <p class="text-(--text-secondary)">Découvrez nos meilleures ventes</p>
          </div>
          <Button
            variant="outline"
            @click="$router.push('/products')"
            class="hidden sm:flex items-center gap-2"
          >
            <span>Voir tout</span>
            <ArrowRight class="w-4 h-4" />
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="productsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="animate-pulse">
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
          <Button variant="outline" size="sm" class="mt-3" @click="loadProducts">
            Réessayer
          </Button>
        </Alert>

        <!-- Products Grid -->
        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            :is-in-wishlist="wishlistStore.isInWishlist(product.id)"
            @click="goToProduct"
            @add-to-cart="addToCart"
            @toggle-wishlist="toggleWishlist"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <Package class="w-16 h-16 mx-auto text-(--text-muted) mb-4" />
          <p class="text-(--text-secondary)">Aucun produit disponible pour le moment</p>
        </div>

        <!-- View All Button Mobile -->
        <div class="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            full-width
            @click="$router.push('/products')"
          >
            <span>Voir tous les produits</span>
            <ArrowRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-24 bg-(--bg-secondary)">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-(--text-primary) mb-3">
            Pourquoi choisir Baobab Market ?
          </h2>
          <p class="text-(--text-secondary)">Une expérience d'achat exceptionnelle</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="group p-6 bg-(--bg-primary) rounded-xl border border-(--border-light) hover:border-(--color-primary) hover:shadow-lg transition-smooth">
            <div class="w-12 h-12 rounded-lg bg-(--color-primary-100) flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck class="w-6 h-6 text-(--color-primary)" />
            </div>
            <h3 class="text-xl font-semibold text-(--text-primary) mb-2">Livraison rapide</h3>
            <p class="text-(--text-secondary)">Livraison en 24-48h dans toute l'Europe</p>
          </div>

          <div class="group p-6 bg-(--bg-primary) rounded-xl border border-(--border-light) hover:border-(--color-primary) hover:shadow-lg transition-smooth">
            <div class="w-12 h-12 rounded-lg bg-(--color-primary-100) flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield class="w-6 h-6 text-(--color-primary)" />
            </div>
            <h3 class="text-xl font-semibold text-(--text-primary) mb-2">Paiement sécurisé</h3>
            <p class="text-(--text-secondary)">Transactions 100% sécurisées et cryptées</p>
          </div>

          <div class="group p-6 bg-(--bg-primary) rounded-xl border border-(--border-light) hover:border-(--color-primary) hover:shadow-lg transition-smooth">
            <div class="w-12 h-12 rounded-lg bg-(--color-primary-100) flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Headphones class="w-6 h-6 text-(--color-primary)" />
            </div>
            <h3 class="text-xl font-semibold text-(--text-primary) mb-2">Support 24/7</h3>
            <p class="text-(--text-secondary)">Notre équipe à votre service 7j/7</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="!authStore.isAuthenticated" class="py-16 md:py-24 bg-(--bg-primary)">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center gradient-bg rounded-2xl p-12 text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez notre communauté
          </h2>
          <p class="text-lg mb-8 opacity-90">
            Créez votre compte et profitez d'avantages exclusifs
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              @click="$router.push('/register')"
            >
              Créer un compte
            </Button>
            <Button
              variant="ghost"
              size="lg"
              class="!text-white hover:!bg-white/20"
              @click="$router.push('/login')"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import Button from '../components/ui/Button.vue'
import Alert from '../components/ui/Alert.vue'
import ProductCard from '../components/shared/ProductCard.vue'
import {
  ArrowRight,
  Package,
  Truck,
  Shield,
  Headphones,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const featuresSection = ref<HTMLElement>()

const featuredProducts = computed(() => {
  return productsStore.products.slice(0, 8)
})

const loadProducts = async () => {
  await productsStore.fetchProducts({ limit: 8 })
}

const goToProduct = (product: any) => {
  router.push(`/products/${product.id}`)
}

const addToCart = async (productId: string) => {
  await cartStore.addItem({ produit_id: productId, quantite: 1 })
}

const toggleWishlist = async (productId: string) => {
  if (wishlistStore.isInWishlist(productId)) {
    await wishlistStore.removeItem(productId)
  } else {
    await wishlistStore.addItem(productId)
  }
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, var(--border-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-light) 1px, transparent 1px);
  background-size: 40px 40px;
}

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
</style>
