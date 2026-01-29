<template>
  <div class="min-h-screen bg-(--bg-secondary)">
    <!-- Breadcrumb -->
    <div class="bg-(--bg-primary) border-b border-(--border-light)">
      <div class="container mx-auto px-4 py-4">
        <Breadcrumb :items="breadcrumbItems" />
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-(--text-primary)">Ma Liste de Souhaits</h1>
          <p v-if="!wishlistStore.loading && wishlistStore.wishlist.length > 0" class="text-sm text-(--text-muted) mt-1">
            {{ wishlistStore.wishlist.length }} produit{{ wishlistStore.wishlist.length > 1 ? 's' : '' }}
          </p>
        </div>

        <Button
          v-if="wishlistStore.wishlist.length > 0"
          variant="outline"
          size="sm"
          @click="addAllToCart"
          :loading="cartStore.loading"
        >
          <ShoppingCart class="w-4 h-4" />
          Tout ajouter au panier
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="wishlistStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="animate-pulse">
          <div class="bg-(--bg-tertiary) aspect-square rounded-xl mb-4"></div>
          <div class="h-4 bg-(--bg-tertiary) rounded mb-2"></div>
          <div class="h-4 bg-(--bg-tertiary) rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <Alert
        v-else-if="wishlistStore.error"
        variant="error"
        :title="'Erreur de chargement'"
        closeable
        @close="wishlistStore.error = null"
      >
        <p>{{ wishlistStore.error }}</p>
        <Button variant="outline" size="sm" class="mt-3" @click="wishlistStore.fetchWishlist()">
          Réessayer
        </Button>
      </Alert>

      <!-- Empty Wishlist -->
      <div v-else-if="wishlistStore.wishlist.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-(--bg-tertiary) flex items-center justify-center">
          <Heart class="w-12 h-12 text-(--text-muted)" />
        </div>
        <h2 class="text-2xl font-semibold text-(--text-primary) mb-2">Votre liste de souhaits est vide</h2>
        <p class="text-(--text-secondary) mb-6">Découvrez nos produits et ajoutez-les à votre liste de souhaits</p>
        <Button variant="primary" @click="$router.push('/products')">
          <Package class="w-5 h-5" />
          Découvrir les produits
        </Button>
      </div>

      <!-- Wishlist Items -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in wishlistStore.wishlist"
          :key="item.id"
          class="relative group"
        >
          <!-- Remove Button -->
          <button
            @click="removeFromWishlist(item.produit.id)"
            class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-smooth shadow-md"
            title="Retirer des favoris"
          >
            <Trash2 class="w-4 h-4" />
          </button>

          <!-- Product Card -->
          <div
            class="cursor-pointer bg-(--bg-primary) rounded-xl overflow-hidden transition-smooth border border-(--border-light) hover:border-(--color-primary) hover:shadow-lg hover:-translate-y-1"
            @click="goToProduct(item.produit.id)"
          >
            <!-- Image -->
            <div class="relative aspect-square overflow-hidden bg-(--bg-tertiary)">
              <img
                v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                :alt="item.produit.nom"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div v-else class="flex items-center justify-center w-full h-full text-(--text-muted)">
                <ImageOff class="w-16 h-16" />
              </div>

              <!-- Badge Stock -->
              <div v-if="item.produit.quantite_stock <= 0" class="absolute top-3 left-3">
                <Badge variant="error">Rupture de stock</Badge>
              </div>
              <div v-else-if="item.produit.quantite_stock < 10" class="absolute top-3 left-3">
                <Badge variant="warning">Stock limité</Badge>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-3">
              <!-- Category -->
              <p v-if="item.produit.categorie" class="text-xs text-(--text-muted) uppercase tracking-wide">
                {{ item.produit.categorie.nom }}
              </p>

              <!-- Title -->
              <h3 class="text-base font-semibold text-(--text-primary) line-clamp-2 min-h-[3rem]">
                {{ item.produit.nom }}
              </h3>

              <!-- Price -->
              <p class="text-xl font-bold text-(--color-primary)">
                {{ formatPrice(item.produit.prix) }}
              </p>

              <!-- Actions -->
              <Button
                v-if="item.produit.est_actif && item.produit.quantite_stock > 0"
                @click.stop="addToCart(item.produit.id)"
                variant="primary"
                size="sm"
                full-width
                :loading="cartStore.loading"
              >
                <ShoppingCart class="w-4 h-4" />
                Ajouter au panier
              </Button>
              <Button
                v-else
                variant="outline"
                size="sm"
                full-width
                disabled
              >
                Indisponible
              </Button>
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
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Alert from '../components/ui/Alert.vue'
import {
  Heart,
  Package,
  ShoppingCart,
  Trash2,
  ImageOff,
} from 'lucide-vue-next'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const router = useRouter()

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Ma liste de souhaits', to: '/wishlist' },
]

onMounted(() => {
  wishlistStore.fetchWishlist()
})

const addToCart = async (productId: string) => {
  try {
    await cartStore.addItem({ produit_id: productId, quantite: 1 })
    // TODO: Show success toast
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const addAllToCart = async () => {
  try {
    for (const item of wishlistStore.wishlist) {
      if (item.produit.est_actif && item.produit.quantite_stock > 0) {
        await cartStore.addItem({ produit_id: item.produit.id, quantite: 1 })
      }
    }
    // TODO: Show success toast
  } catch (error) {
    console.error('Error adding all to cart:', error)
  }
}

const goToProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const removeFromWishlist = async (productId: string) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    // TODO: Show success toast
  } catch (error) {
    console.error('Error removing from wishlist:', error)
  }
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`
}
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
</style>
