<template>
  <div
    :class="cardClasses"
    @click="$emit('click', product)"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden bg-(--bg-tertiary) group">
      <img
        v-if="product.images_produits && product.images_produits.length > 0"
        :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
        :alt="product.nom"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex items-center justify-center w-full h-full text-[var(--text-muted)]">
        <svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Badge Stock -->
      <div v-if="product.stock <= 0" class="absolute top-3 left-3">
        <Badge variant="error">Rupture de stock</Badge>
      </div>
      <div v-else-if="product.stock < 10" class="absolute top-3 left-3">
        <Badge variant="warning">Stock limité</Badge>
      </div>

      <!-- Wishlist Button -->
      <button
        v-if="showWishlist"
        @click.stop="$emit('toggleWishlist', product.id)"
        class="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-smooth shadow-md"
        :class="wishlistButtonClass"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-2">
      <!-- Category -->
      <p v-if="product.categorie" class="text-xs text-[var(--text-muted)] uppercase tracking-wide">
        {{ product.categorie.nom }}
      </p>

      <!-- Title -->
      <h3 class="text-base font-semibold text-[var(--text-primary)] line-clamp-2 min-h-[3rem]">
        {{ product.nom }}
      </h3>

      <!-- Description -->
      <p v-if="showDescription && product.description" class="text-sm text-[var(--text-secondary)] line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price & Action -->
      <div class="flex items-center justify-between pt-2">
        <div class="space-y-1">
          <p class="text-xl font-bold text-[var(--color-primary)]">
            {{ formatPrice(product.prix) }}
          </p>
          <p v-if="showStock" class="text-xs text-[var(--text-muted)]">
            Stock: {{ product.quantite_stock }}
          <p v-if="showStock" class="text-xs text-(--text-muted)">
            Stock: {{ product.stock }}
          </p>
        </div>

        <button
          v-if="showAddToCart"
          @click.stop="$emit('addToCart', product.id)"
          :disabled="product.stock <= 0"
          class="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-700) disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center gap-2 text-sm font-medium"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '../ui/Badge.vue'
import type { Product } from '../../types/api'

interface Props {
  product: Product
  showDescription?: boolean
  showStock?: boolean
  showWishlist?: boolean
  showAddToCart?: boolean
  isInWishlist?: boolean
}

withDefaults(defineProps<Props>(), {
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

const cardClasses = computed(() => [
  'group cursor-pointer bg-(--bg-primary) rounded-xl overflow-hidden transition-smooth',
  'border border-(--border-light) hover:border-(--color-primary)',
  'hover:shadow-lg hover:-translate-y-1',
])

const wishlistButtonClass = computed(() => [
  'absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-smooth shadow-md',
  isInWishlist ? 'text-red-500' : 'text-gray-400'
])

const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
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
