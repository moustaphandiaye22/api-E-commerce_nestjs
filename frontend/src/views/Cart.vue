<template>
  <div class="min-h-screen bg-(--bg-secondary)">
    <!-- Breadcrumb -->
    <div class="bg-(--bg-primary) border-b border-(--border-light)">
      <div class="container mx-auto px-4 py-4">
        <Breadcrumb :items="breadcrumbItems" />
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">Mon Panier</h1>
        <p v-if="!cartStore.loading && cartStore.cart" class="text-sm text-[var(--text-muted)]">
          {{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }} dans votre panier
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="cartStore.loading" class="flex items-center justify-center py-16">
        <div class="text-center space-y-4">
          <Spinner size="lg" />
          <p class="text-[var(--text-secondary)]">Chargement du panier...</p>
        </div>
      </div>

      <!-- Error State -->
      <Alert
        v-else-if="cartStore.error"
        variant="error"
        :title="'Erreur de chargement'"
        closeable
        @close="cartStore.error = null"
      >
        <p>{{ cartStore.error }}</p>
        <Button variant="outline" size="sm" class="mt-3" @click="cartStore.fetchCart()">
          Réessayer
        </Button>
      </Alert>

      <!-- Empty Cart -->
      <div v-else-if="!cartStore.cart || cartStore.cart.articles_panier.length === 0" class="py-16">
        <div class="max-w-md mx-auto text-center space-y-6">
          <div class="w-24 h-24 mx-auto rounded-full bg-(--bg-tertiary) flex items-center justify-center">
            <ShoppingCart class="w-12 h-12 text-[var(--text-muted)]" />
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-[var(--text-primary)]">Votre panier est vide</h2>
            <p class="text-[var(--text-secondary)]">Découvrez nos produits et ajoutez-les à votre panier</p>
          </div>
          <Button variant="primary" size="lg" @click="$router.push('/products')">
            <Package class="w-5 h-5" />
            Découvrir nos produits
          </Button>
        </div>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.cart.articles_panier"
            :key="item.id"
            class="bg-(--bg-primary) rounded-xl border border-(--border-light) overflow-hidden hover:border-(--color-primary) transition-smooth"
          >
            <div class="p-4 md:p-6">
              <div class="flex gap-4">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-(--bg-tertiary)">
                    <img
                      v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                      :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                      :alt="item.produit.nom"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <ImageIcon class="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                  </div>
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">
                        {{ item.produit.nom }}
                      </h3>
                      <p v-if="item.produit.categorie" class="text-sm text-[var(--text-muted)]">
                        {{ item.produit.categorie.nom }}
                      </p>
                    </div>
                    <button
                      @click="removeItem(item.id)"
                      class="flex-shrink-0 p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-smooth"
                      title="Retirer du panier"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <!-- Price -->
                    <div class="space-y-1">
                      <p class="text-2xl font-bold text-[var(--color-primary)]">
                        {{ formatPrice(parseFloat(item.prix_unitaire)) }}
                      </p>
                      <p class="text-sm text-[var(--text-muted)]">Prix unitaire</p>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-3">
                      <span class="text-sm text-[var(--text-secondary)] font-medium">Quantité:</span>
                      <div class="flex items-center gap-2 bg-(--bg-secondary) rounded-lg p-1 border border-(--border-light)">
                        <button
                          @click="updateQuantity(item.id, item.quantite - 1)"
                          :disabled="item.quantite <= 1"
                          class="p-2 rounded-lg text-[var(--text-primary)] hover:bg-(--bg-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                        >
                          <Minus class="w-4 h-4" />
                        </button>
                        <span class="min-w-[2.5rem] text-center font-semibold text-[var(--text-primary)]">
                          {{ item.quantite }}
                        </span>
                        <button
                          @click="updateQuantity(item.id, item.quantite + 1)"
                          class="p-2 rounded-lg text-[var(--text-primary)] hover:bg-(--bg-hover) transition-smooth"
                        >
                          <Plus class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <!-- Item Total -->
                    <div class="sm:text-right">
                      <p class="text-sm text-[var(--text-muted)] mb-1">Total</p>
                      <p class="text-xl font-bold text-[var(--text-primary)]">
                        {{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) overflow-hidden sticky top-24">
            <div class="p-6 border-b border-(--border-light) bg-(--bg-secondary)">
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">Résumé de la commande</h2>
            </div>

            <div class="p-6 space-y-6">
              <!-- Coupon Section -->
              <div class="space-y-3">
                <h3 class="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                  <Tag class="w-4 h-4" />
                  Code promo
                </h3>
                <div v-if="!cartStore.appliedCoupon" class="flex gap-2">
                  <input
                    v-model="couponCode"
                    type="text"
                    placeholder="Entrer le code"
                    @keyup.enter="applyCoupon"
                    class="flex-1 px-4 py-2.5 rounded-lg border border-(--border-medium) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm"
                  />
                  <Button
                    @click="applyCoupon"
                    :disabled="!couponCode.trim()"
                    variant="primary"
                    size="sm"
                  >
                    Appliquer
                  </Button>
                </div>
                <div v-else class="flex items-center justify-between p-3 rounded-lg bg-(--color-success)/10 border border-(--color-success)/20">
                  <div class="flex items-center gap-2">
                    <div class="p-1 rounded bg-(--color-success) text-white">
                      <Check class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-[var(--color-success)]">
                        {{ cartStore.appliedCoupon.coupon.code }}
                      </p>
                      <p class="text-xs text-[var(--text-secondary)]">
                        -{{ formatPrice(cartStore.discountAmount) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeCoupon"
                    class="p-1 rounded-lg hover:bg-(--bg-hover) transition-smooth"
                  >
                    <X class="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              <div class="h-px bg-(--border-light)"></div>

              <!-- Summary Details -->
              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[var(--text-secondary)]">
                    Sous-total ({{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }})
                  </span>
                  <span class="font-medium text-[var(--text-primary)]">
                    {{ formatPrice(cartStore.totalAmount) }}
                  </span>
                </div>
                <div v-if="cartStore.discountAmount > 0" class="flex items-center justify-between text-sm">
                  <span class="text-[var(--text-secondary)]">Réduction</span>
                  <span class="font-medium text-[var(--color-success)]">
                    -{{ formatPrice(cartStore.discountAmount) }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[var(--text-secondary)] flex items-center gap-1">
                    <Truck class="w-4 h-4" />
                    Livraison
                  </span>
                  <span class="text-[var(--text-muted)] text-xs">
                    Calculé à l'étape suivante
                  </span>
                </div>
              </div>

              <div class="h-px bg-(--border-light)"></div>

              <!-- Total -->
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold text-[var(--text-primary)]">Total</span>
                <span class="text-2xl font-bold text-[var(--color-primary)]">
                  {{ formatPrice(cartStore.finalAmount) }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3 pt-2">
                <Button
                  @click="proceedToCheckout"
                  variant="primary"
                  size="lg"
                  full-width
                  class="group"
                >
                  <span>Procéder au paiement</span>
                  <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  @click="clearCart"
                  variant="outline"
                  size="md"
                  full-width
                  class="!text-red-600 !border-red-200 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                >
                  <Trash2 class="w-4 h-4" />
                  Vider le panier
                </Button>
              </div>

              <!-- Trust Badges -->
              <div class="pt-4 space-y-3">
                <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <div class="flex-shrink-0 p-2 rounded-lg bg-(--color-success)/10">
                    <Shield class="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <div class="flex-shrink-0 p-2 rounded-lg bg-(--color-primary)/10">
                    <Truck class="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <span>Livraison rapide 24-48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Button from '../components/ui/Button.vue'
import Alert from '../components/ui/Alert.vue'
import Spinner from '../components/ui/Spinner.vue'
import {
  ShoppingCart,
  Package,
  Trash2,
  Minus,
  Plus,
  Tag,
  Check,
  X,
  Truck,
  Shield,
  ArrowRight,
  ImageIcon,
} from 'lucide-vue-next'

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const cartStore = useCartStore()
const router = useRouter()

// Coupon
const couponCode = ref('')

// Breadcrumb
const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Mon Panier', to: '/cart' },
]

onMounted(() => {
  cartStore.fetchCart()
})

const updateQuantity = async (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return
  await cartStore.updateItem(itemId, newQuantity)
}

const removeItem = async (itemId: string) => {
  if (confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
    await cartStore.removeItem(itemId)
  }
}

const clearCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    await cartStore.clearCart()
  }
}

const applyCoupon = async () => {
  if (!couponCode.value.trim()) return

  try {
    await cartStore.applyCoupon(couponCode.value.trim())
    couponCode.value = ''
  } catch (error) {
    console.error('Error applying coupon:', error)
  }
}

const removeCoupon = () => {
  cartStore.removeCoupon()
}

const proceedToCheckout = () => {
  router.push('/checkout')
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}
</script>
