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
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-(--text-primary) mb-2">Finaliser ma commande</h1>
        <p class="text-(--text-muted)">Complétez vos informations pour valider votre achat</p>
      </div>

      <!-- Loading State -->
      <div v-if="cartStore.loading" class="flex justify-center py-12">
        <Spinner size="lg" />
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!cartStore.cart || cartStore.cart.articles_panier.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-(--bg-tertiary) flex items-center justify-center">
          <ShoppingCart class="w-12 h-12 text-(--text-muted)" />
        </div>
        <h2 class="text-2xl font-semibold text-(--text-primary) mb-2">Votre panier est vide</h2>
        <p class="text-(--text-secondary) mb-6">Ajoutez des produits pour continuer</p>
        <Button variant="primary" @click="$router.push('/products')">
          <Package class="w-5 h-5" />
          Continuer vos achats
        </Button>
      </div>

      <!-- Checkout Content -->
      <form v-else @submit.prevent="handleSubmit" class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column - Forms -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address -->
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center">
                <Truck class="w-5 h-5 text-(--color-primary)" />
              </div>
              <h2 class="text-xl font-semibold text-(--text-primary)">Adresse de livraison</h2>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <Input
                v-model="shippingAddress.prenom"
                label="Prénom"
                placeholder="Jean"
                required
              />
              <Input
                v-model="shippingAddress.nom"
                label="Nom"
                placeholder="Dupont"
                required
              />
              <div class="sm:col-span-2">
                <Input
                  v-model="shippingAddress.rue"
                  label="Adresse"
                  placeholder="123 Rue de la Paix"
                  required
                />
              </div>
              <Input
                v-model="shippingAddress.code_postal"
                label="Code postal"
                placeholder="75001"
                required
              />
              <Input
                v-model="shippingAddress.ville"
                label="Ville"
                placeholder="Paris"
                required
              />
              <div class="sm:col-span-2">
                <Select
                  v-model="shippingAddress.pays"
                  label="Pays"
                  required
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </Select>
              </div>
            </div>
          </div>

          <!-- Billing Address -->
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center">
                <FileText class="w-5 h-5 text-(--color-primary)" />
              </div>
              <h2 class="text-xl font-semibold text-(--text-primary)">Adresse de facturation</h2>
            </div>

            <label class="flex items-center gap-3 mb-6 cursor-pointer group">
              <input
                type="checkbox"
                v-model="sameAddress"
                @change="toggleSameAddress"
                class="w-5 h-5 rounded border-(--border-medium) text-(--color-primary) focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0"
              />
              <span class="text-(--text-secondary) group-hover:text-(--text-primary) transition-smooth">
                Identique à l'adresse de livraison
              </span>
            </label>

            <div v-if="!sameAddress" class="grid sm:grid-cols-2 gap-4">
              <Input
                v-model="billingAddress.prenom"
                label="Prénom"
                placeholder="Jean"
                required
              />
              <Input
                v-model="billingAddress.nom"
                label="Nom"
                placeholder="Dupont"
                required
              />
              <div class="sm:col-span-2">
                <Input
                  v-model="billingAddress.rue"
                  label="Adresse"
                  placeholder="123 Rue de la Paix"
                  required
                />
              </div>
              <Input
                v-model="billingAddress.code_postal"
                label="Code postal"
                placeholder="75001"
                required
              />
              <Input
                v-model="billingAddress.ville"
                label="Ville"
                placeholder="Paris"
                required
              />
              <div class="sm:col-span-2">
                <Select
                  v-model="billingAddress.pays"
                  label="Pays"
                  required
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </Select>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-(--color-primary-100) flex items-center justify-center">
                <CreditCard class="w-5 h-5 text-(--color-primary)" />
              </div>
              <h2 class="text-xl font-semibold text-(--text-primary)">Méthode de paiement</h2>
            </div>

            <label class="flex items-start gap-4 p-4 border-2 border-(--border-light) rounded-lg cursor-pointer hover:border-(--color-primary) transition-smooth">
              <input
                type="radio"
                v-model="paymentMethod"
                value="stripe"
                required
                class="mt-1 w-5 h-5 text-(--color-primary) focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <CreditCard class="w-5 h-5 text-(--color-primary)" />
                  <span class="font-medium text-(--text-primary)">Carte bancaire</span>
                </div>
                <p class="text-sm text-(--text-muted)">Visa, MasterCard, American Express</p>
                <div class="flex items-center gap-2 mt-2">
                  <Shield class="w-4 h-4 text-green-600" />
                  <span class="text-xs text-green-600">Paiement 100% sécurisé</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6 sticky top-24">
            <h2 class="text-xl font-semibold text-(--text-primary) mb-6">Résumé de la commande</h2>

            <!-- Items -->
            <div class="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-hidden">
              <div
                v-for="item in cartStore.cart.articles_panier"
                :key="item.id"
                class="flex items-center gap-3"
              >
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-(--bg-tertiary) flex-shrink-0">
                  <img
                    v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                    :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                    :alt="item.produit.nom"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="flex items-center justify-center w-full h-full">
                    <ImageOff class="w-6 h-6 text-(--text-muted)" />
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-(--text-primary) text-sm truncate">
                    {{ item.produit.nom }}
                  </h4>
                  <p class="text-xs text-(--text-muted)">
                    Qté: {{ item.quantite }}
                  </p>
                </div>

                <p class="font-semibold text-(--text-primary) text-sm">
                  {{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }}
                </p>
              </div>
            </div>

            <div class="border-t border-(--border-light) pt-4 space-y-3">
              <div class="flex justify-between text-(--text-secondary)">
                <span>Sous-total</span>
                <span>{{ formatPrice(cartStore.totalAmount) }}</span>
              </div>
              <div class="flex justify-between text-(--text-secondary)">
                <span>Livraison</span>
                <span>{{ formatPrice(shippingCost) }}</span>
              </div>
              <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-green-600">
                <span>Réduction</span>
                <span>-{{ formatPrice(cartStore.discountAmount) }}</span>
              </div>
              <div class="border-t border-(--border-light) pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-(--text-primary)">Total</span>
                  <span class="text-2xl font-bold text-(--color-primary)">
                    {{ formatPrice(totalAmount) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              variant="primary"
              size="lg"
              full-width
              class="mt-6"
              :loading="ordersStore.loading"
            >
              <Lock class="w-5 h-5" />
              Payer {{ formatPrice(totalAmount) }}
            </Button>

            <!-- Security Info -->
            <div class="mt-4 p-3 bg-(--bg-secondary) rounded-lg">
              <div class="flex items-start gap-2">
                <Shield class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-medium text-(--text-primary) mb-1">Paiement sécurisé</p>
                  <p class="text-xs text-(--text-muted)">Vos informations sont protégées par un cryptage SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { formatPrice } from '../utils/formatters'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Select from '../components/ui/Select.vue'
import Spinner from '../components/ui/Spinner.vue'
import {
  ShoppingCart,
  Package,
  Truck,
  FileText,
  CreditCard,
  Shield,
  Lock,
  ImageOff,
} from 'lucide-vue-next'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const router = useRouter()

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Panier', to: '/cart' },
  { label: 'Paiement', to: '/checkout' },
]

// Form data
const shippingAddress = ref({
  prenom: '',
  nom: '',
  rue: '',
  code_postal: '',
  ville: '',
  pays: 'France',
})

const billingAddress = ref({
  prenom: '',
  nom: '',
  rue: '',
  code_postal: '',
  ville: '',
  pays: 'France',
})

const sameAddress = ref(true)
const paymentMethod = ref('stripe')

// Constants
const shippingCost = 5.99

const totalAmount = computed(() => {
  const subtotal = cartStore.finalAmount || cartStore.totalAmount
  return subtotal + shippingCost
})

const toggleSameAddress = () => {
  if (sameAddress.value) {
    billingAddress.value = { ...shippingAddress.value }
  }
}

const handleSubmit = async () => {
  try {
    const orderData = {
      shippingAddress: shippingAddress.value,
      billingAddress: sameAddress.value ? shippingAddress.value : billingAddress.value,
    }

    const order = await ordersStore.createOrder(orderData)

    if (order) {
      // TODO: Implement Stripe payment flow
      // For now, just clear cart and redirect to orders
      await cartStore.clearCart()
      router.push('/orders')
      // TODO: Show success toast
    }
  } catch (error) {
    console.error('Error creating order:', error)
    // TODO: Show error toast
  }
}

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`
}

onMounted(() => {
  if (!cartStore.cart) {
    cartStore.fetchCart()
  }
})
</script>

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
