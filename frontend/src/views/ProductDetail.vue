<template>
  <div class="min-h-screen bg-(--bg-secondary)">
    <!-- Breadcrumb -->
    <div class="bg-(--bg-primary) border-b border-(--border-light)">
      <div class="container mx-auto px-4 py-4">
        <Breadcrumb :items="breadcrumbItems" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 gap-12 animate-pulse">
        <div class="aspect-square bg-(--bg-tertiary) rounded-2xl"></div>
        <div class="space-y-4">
          <div class="h-8 bg-(--bg-tertiary) rounded w-3/4"></div>
          <div class="h-6 bg-(--bg-tertiary) rounded w-1/4"></div>
          <div class="h-12 bg-(--bg-tertiary) rounded w-1/3"></div>
          <div class="h-32 bg-(--bg-tertiary) rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="container mx-auto px-4 py-12">
      <Alert variant="error" :title="'Erreur de chargement'" closeable>
        <p>{{ productsStore.error }}</p>
        <Button variant="outline" size="sm" class="mt-3" @click="$router.back()">
          Retour
        </Button>
      </Alert>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 gap-12 mb-16">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="aspect-square bg-(--bg-tertiary) rounded-2xl overflow-hidden group">
            <img
              v-if="product.images_produits && product.images_produits.length > 0"
              :src="getImageUrl(product.images_produits.find(img => img.est_principale)?.url_image || product.images_produits[0]?.url_image)"
              :alt="product.nom"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="flex items-center justify-center w-full h-full text-[var(--text-muted)]">
              <ImageOff class="w-24 h-24" />
            </div>
          </div>

          <!-- Thumbnail Gallery (if multiple images) -->
          <div v-if="product.images_produits && product.images_produits.length > 1" class="grid grid-cols-4 gap-3">
            <button
              v-for="(image, index) in product.images_produits.slice(0, 4)"
              :key="index"
              class="aspect-square bg-(--bg-tertiary) rounded-lg overflow-hidden border-2 border-transparent hover:border-(--color-primary) transition-smooth"
            >
              <img
                :src="getImageUrl(image.url_image)"
                :alt="`${product.nom} - Image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Category -->
          <div v-if="product.categorie">
            <Badge variant="secondary">{{ product.categorie.nom }}</Badge>
          </div>

          <!-- Title -->
          <h1 class="text-4xl font-bold text-[var(--text-primary)]">
            {{ product.nom }}
          </h1>

          <!-- Rating -->
          <div v-if="product.avis && product.avis.length > 0" class="flex items-center gap-4">
            <Rating :rating="averageRating" :count="product.avis.length" show-count show-value />
          </div>

          <!-- Price -->
          <div class="flex items-baseline gap-4">
            <p class="text-5xl font-bold text-[var(--color-primary)]">
              {{ formatPrice(product.prix) }}
            </p>
          </div>

          <!-- Stock Status -->
          <div>
            <Badge v-if="product.quantite_stock > 0" variant="success" size="lg">
              <CheckCircle class="w-4 h-4" />
              En stock ({{ product.quantite_stock }} disponible{{ product.quantite_stock > 1 ? 's' : '' }})
            </Badge>
            <Badge v-else variant="error" size="lg">
              <XCircle class="w-4 h-4" />
              Rupture de stock
            </Badge>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <Button
              v-if="authStore.isAuthenticated()"
              @click="addToCart"
              :disabled="!product.est_actif || product.quantite_stock === 0"
              variant="primary"
              size="lg"
              class="flex-1"
            >
              <ShoppingCart class="w-5 h-5" />
              Ajouter au panier
            </Button>
            <Button
              v-else
              @click="redirectToLogin"
              variant="primary"
              size="lg"
              class="flex-1"
            >
              Se connecter pour acheter
            </Button>

            <Button
              v-if="authStore.isAuthenticated()"
              @click="toggleWishlist"
              :variant="isInWishlist ? 'secondary' : 'outline'"
              size="lg"
            >
              <Heart :fill="isInWishlist ? 'currentColor' : 'none'" class="w-5 h-5" />
            </Button>
            <Button
              v-else
              @click="redirectToLogin"
              variant="outline"
              size="lg"
            >
              <Heart class="w-5 h-5" />
            </Button>
          </div>

          <!-- Description -->
          <div class="pt-6 border-t border-(--border-light)">
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">Description</h3>
            <p class="text-[var(--text-secondary)] leading-relaxed">
              {{ product.description || 'Aucune description disponible pour ce produit.' }}
            </p>
          </div>

          <!-- Variants -->
          <div v-if="product.variantes && product.variantes.length > 0" class="pt-6 border-t border-(--border-light)">
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Variantes disponibles</h3>
            <div class="space-y-3">
              <div
                v-for="variant in product.variantes"
                :key="variant.id"
                class="flex items-center justify-between p-4 bg-(--bg-secondary) rounded-lg border border-(--border-light)"
              >
                <span class="font-medium text-[var(--text-primary)]">{{ variant.nom }}</span>
                <Badge variant="primary">+{{ formatPrice(variant.prix_supplementaire) }}</Badge>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="pt-6 border-t border-(--border-light)">
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Avantages</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center flex-shrink-0">
                  <Truck class="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p class="font-medium text-[var(--text-primary)]">Livraison rapide</p>
                  <p class="text-sm text-[var(--text-muted)]">Sous 24-48h</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center flex-shrink-0">
                  <Shield class="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p class="font-medium text-[var(--text-primary)]">Paiement sécurisé</p>
                  <p class="text-sm text-[var(--text-muted)]">100% sécurisé</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center flex-shrink-0">
                  <RotateCcw class="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p class="font-medium text-[var(--text-primary)]">Retour facile</p>
                  <p class="text-sm text-[var(--text-muted)]">14 jours</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center flex-shrink-0">
                  <Headphones class="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p class="font-medium text-[var(--text-primary)]">Support 24/7</p>
                  <p class="text-sm text-[var(--text-muted)]">À votre écoute</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="max-w-4xl">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-[var(--text-primary)]">Avis clients</h2>
          <Badge variant="secondary" size="lg">
            {{ reviewsStore.reviews.length }} avis
          </Badge>
        </div>

        <!-- Add Review (Authenticated users) -->
        <div v-if="authStore.isAuthenticated()" class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6 mb-8">
          <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Donner votre avis</h3>
          <form @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Note</label>
              <Rating
                v-model:rating="newReview.note"
                :interactive="true"
                size="lg"
              />
            </div>

            <Input
              v-model="newReview.titre"
              label="Titre (optionnel)"
              placeholder="Résumez votre avis..."
            />

            <div>
              <label for="review-comment" class="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Commentaire *
              </label>
              <textarea
                id="review-comment"
                v-model="newReview.commentaire"
                placeholder="Partagez votre expérience avec ce produit..."
                required
                rows="4"
                class="w-full px-4 py-3 bg-(--bg-secondary) border border-(--border-light) rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              variant="primary"
              :loading="reviewsStore.loading"
              :disabled="!newReview.commentaire"
            >
              Publier l'avis
            </Button>
          </form>
        </div>

        <!-- Reviews List -->
        <div v-if="reviewsStore.loading" class="space-y-4">
          <div v-for="n in 3" :key="n" class="animate-pulse bg-(--bg-primary) rounded-xl p-6 border border-(--border-light)">
            <div class="h-4 bg-(--bg-tertiary) rounded w-1/4 mb-4"></div>
            <div class="h-4 bg-(--bg-tertiary) rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-(--bg-tertiary) rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="reviewsStore.error" class="text-center py-8">
          <Alert variant="error">{{ reviewsStore.error }}</Alert>
        </div>

        <div v-else-if="reviewsStore.reviews.length > 0" class="space-y-4">
          <div
            v-for="review in reviewsStore.reviews"
            :key="review.id"
            class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6 hover:shadow-md transition-smooth"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3">
                <Avatar
                  :name="`${review.utilisateur?.prenom} ${review.utilisateur?.nom}`"
                  size="md"
                />
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-[var(--text-primary)]">
                      {{ review.utilisateur?.prenom }} {{ review.utilisateur?.nom }}
                    </h4>
                    <Badge v-if="review.est_verifie" variant="success" size="sm">
                      <CheckCircle class="w-3 h-3" />
                      Vérifié
                    </Badge>
                  </div>
                  <p class="text-sm text-[var(--text-muted)]">{{ formatDate(review.cree_le) }}</p>
                </div>
              </div>
              <Rating :rating="review.note" size="sm" />
            </div>

            <h5 v-if="review.titre" class="font-semibold text-[var(--text-primary)] mb-2">
              {{ review.titre }}
            </h5>

            <p class="text-[var(--text-secondary)] leading-relaxed">
              {{ review.commentaire }}
            </p>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-(--bg-primary) rounded-xl border border-(--border-light)">
          <MessageSquare class="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
          <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-2">Aucun avis pour le moment</h3>
          <p class="text-[var(--text-secondary)] mb-6">Soyez le premier à donner votre avis sur ce produit !</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useReviewsStore } from '../stores/reviews'
import { useAuthStore } from '../stores/auth'
import { formatPrice } from '../utils/formatters'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Alert from '../components/ui/Alert.vue'
import Avatar from '../components/ui/Avatar.vue'
import Rating from '../components/ui/Rating.vue'
import Input from '../components/ui/Input.vue'
import {
  ImageOff,
  ShoppingCart,
  Heart,
  CheckCircle,
  XCircle,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  MessageSquare,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const product = computed(() => productsStore.currentProduct)
const isInWishlist = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false
})

const breadcrumbItems = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'Produits', to: '/products' },
  { label: product.value?.nom || 'Détail', to: `/products/${route.params.id}` },
])

const averageRating = computed(() => {
  if (!product.value?.avis || product.value.avis.length === 0) return 0
  const total = product.value.avis.reduce((sum, review) => sum + review.note, 0)
  return total / product.value.avis.length
})

// New review form
const newReview = ref({
  note: 5,
  titre: '',
  commentaire: '',
})

onMounted(async () => {
  const productId = route.params.id as string

  await Promise.all([
    productsStore.fetchProductById(productId),
    reviewsStore.fetchReviewsByProduct(productId),
  ])
})

const addToCart = async () => {
  if (!authStore.isAuthenticated()) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  if (product.value) {
    await cartStore.addItem({ produit_id: product.value.id, quantite: 1 })
    // TODO: Show toast notification
  }
}

const toggleWishlist = async () => {
  if (!authStore.isAuthenticated()) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  if (product.value) {
    await wishlistStore.toggleWishlist(product.value.id)
  }
}

const redirectToLogin = () => {
  router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
}

const submitReview = async () => {
  if (!product.value) return

  try {
    await reviewsStore.createReview({
      produit_id: product.value.id,
      note: newReview.value.note,
      titre: newReview.value.titre || undefined,
      commentaire: newReview.value.commentaire,
    })

    // Reset form
    newReview.value = { note: 5, titre: '', commentaire: '' }
    
    // TODO: Show success toast
  } catch (error) {
    console.error('Error submitting review:', error)
    // TODO: Show error toast
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getImageUrl = (url?: string) => {
  if (!url) return ''
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
