<template>
  <div
    :class="cardClasses"
    @click="$emit('click', product)"
  >
    <!-- Image -->
    <div :class="imageContainerClasses">
      <img
        v-if="product.images_produits && product.images_produits.length > 0"
        :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
        :alt="product.nom"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex items-center justify-center w-full h-full bg-(--bg-tertiary) text-[var(--text-muted)]">
        <ImageIcon :class="showDescription ? 'w-12 h-12' : 'w-16 h-16'" />
      </div>

      <!-- Badge Stock -->
      <div v-if="product.quantite_stock <= 0" :class="badgePositionClasses">
        <Badge variant="error" size="sm">Rupture</Badge>
      </div>
      <div v-else-if="product.quantite_stock < 10" :class="badgePositionClasses">
        <Badge variant="warning" size="sm">Stock limité</Badge>
      </div>

      <!-- Wishlist Button -->
      <button
        v-if="showWishlist"
        @click.stop="$emit('toggleWishlist', product.id)"
        :class="wishlistButtonClass"
        aria-label="Add to wishlist"
      >
        <Heart :class="props.isInWishlist ? 'fill-current' : ''" class="w-4 h-4" />
      </button>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <!-- Category -->
      <p v-if="product.categorie" class="text-xs text-[var(--text-muted)] uppercase tracking-wide">
        {{ product.categorie.nom }}
      </p>

      <!-- Title -->
      <h3 :class="titleClasses">
        {{ product.nom }}
      </h3>

      <!-- Description (only in list view) -->
      <p v-if="showDescription && product.description" class="text-sm text-[var(--text-secondary)] line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price & Action Row -->
      <div :class="actionRowClasses">
        <div class="space-y-1 flex-1">
          <p :class="priceClasses">
            {{ formatPrice(product.prix) }}
          </p>
          <p v-if="showStock" class="text-xs text-[var(--text-muted)]">
            <span v-if="product.quantite_stock > 0">
              {{ product.quantite_stock }} en stock
            </span>
            <span v-else class="text-red-600">Indisponible</span>
          </p>
        </div>

        <button
          v-if="showAddToCart"
          @click.stop="$emit('addToCart', product.id)"
          :disabled="product.quantite_stock <= 0"
          :class="addToCartButtonClasses"
          :aria-label="showDescription ? 'Ajouter au panier' : 'Ajouter'"
        >
          <ShoppingCart class="w-4 h-4 flex-shrink-0" />
          <span v-if="showDescription" class="hidden sm:inline">Ajouter au panier</span>
          <span v-else-if="!showDescription" class="hidden xs:inline">Ajouter</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '../ui/Badge.vue'
import { Heart, ShoppingCart, ImageIcon } from 'lucide-vue-next'
import type { Product } from '../../types/api'

interface Props {
  product: Product
  showDescription?: boolean
  showStock?: boolean
  showWishlist?: boolean
  showAddToCart?: boolean
  isInWishlist?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false,
  showStock: true,
  showWishlist: true,
  showAddToCart: true,
  isInWishlist: false,
})

defineEmits<{
  'click': [product: Product]
  'addToCart': [id: string]
  'toggleWishlist': [id: string]
}>()

// Card layout changes based on showDescription (list view)
const cardClasses = computed(() => [
  'group cursor-pointer bg-(--bg-primary) rounded-xl overflow-hidden transition-smooth',
  'border border-(--border-light) hover:border-(--color-primary)',
  'hover:shadow-lg',
  props.showDescription 
    ? 'flex flex-col sm:flex-row h-auto' // Stack on mobile, row on tablet+
    : 'flex flex-col hover:-translate-y-1',
])

const imageContainerClasses = computed(() => [
  'relative overflow-hidden bg-(--bg-tertiary) flex-shrink-0',
  props.showDescription 
    ? 'w-full h-48 sm:w-48 sm:h-48 md:w-56 md:h-56' // Full width on mobile, fixed on tablet+
    : 'aspect-square w-full'  // Square aspect for grid view
])

const badgePositionClasses = computed(() => [
  'absolute z-10',
  props.showDescription ? 'top-2 left-2' : 'top-3 left-3'
])

const wishlistButtonClass = computed(() => [
  'absolute p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
  'hover:bg-white dark:hover:bg-gray-800 hover:scale-110',
  'transition-smooth shadow-md z-10',
  props.showDescription ? 'top-2 right-2' : 'top-3 right-3',
  props.isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
])

const contentClasses = computed(() => [
  'flex flex-col',
  props.showDescription 
    ? 'flex-1 p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3' 
    : 'p-3 sm:p-4 space-y-2'
])

const titleClasses = computed(() => [
  'font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]',
  props.showDescription 
    ? 'text-base sm:text-lg md:text-xl line-clamp-2' 
    : 'text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]'
])

const priceClasses = computed(() => [
  'font-bold text-[var(--color-primary)]',
  props.showDescription ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
])

const actionRowClasses = computed(() => [
  'flex items-end justify-between gap-2 sm:gap-3',
  props.showDescription ? 'pt-2 sm:pt-3 mt-auto' : 'pt-2'
])

const addToCartButtonClasses = computed(() => [
  'rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-700)',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-smooth flex items-center justify-center gap-2 font-medium',
  'hover:shadow-md active:scale-95',
  props.showDescription 
    ? 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm' 
    : 'px-3 sm:px-4 py-2 text-xs sm:text-sm'
])

const getImageUrl = (url?: string) => {
  if (!url) return ''
  // If URL is already a full URL (Cloudinary or http), return it directly
  if (url.startsWith('http')) return url
  // Otherwise, prepend API URL for local uploads
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(numPrice)
}
</script>
