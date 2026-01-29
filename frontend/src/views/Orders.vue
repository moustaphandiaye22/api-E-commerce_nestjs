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
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-(--text-primary)">Mes Commandes</h1>
        <p v-if="!ordersStore.loading && ordersStore.orders.length > 0" class="text-sm text-(--text-muted) mt-1">
          {{ ordersStore.orders.length }} commande{{ ordersStore.orders.length > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="ordersStore.loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="animate-pulse bg-(--bg-primary) rounded-xl p-6 border border-(--border-light)">
          <div class="flex justify-between mb-4">
            <div class="h-6 bg-(--bg-tertiary) rounded w-1/3"></div>
            <div class="h-6 bg-(--bg-tertiary) rounded w-24"></div>
          </div>
          <div class="h-20 bg-(--bg-tertiary) rounded mb-4"></div>
          <div class="h-10 bg-(--bg-tertiary) rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <Alert
        v-else-if="ordersStore.error"
        variant="error"
        :title="'Erreur de chargement'"
        closeable
        @close="ordersStore.error = null"
      >
        <p>{{ ordersStore.error }}</p>
        <Button variant="outline" size="sm" class="mt-3" @click="ordersStore.fetchOrders()">
          Réessayer
        </Button>
      </Alert>

      <!-- Empty Orders -->
      <div v-else-if="ordersStore.orders.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-(--bg-tertiary) flex items-center justify-center">
          <ShoppingBag class="w-12 h-12 text-(--text-muted)" />
        </div>
        <h2 class="text-2xl font-semibold text-(--text-primary) mb-2">Vous n'avez pas encore de commandes</h2>
        <p class="text-(--text-secondary) mb-6">Découvrez nos produits et passez votre première commande</p>
        <Button variant="primary" @click="$router.push('/products')">
          <Package class="w-5 h-5" />
          Découvrir les produits
        </Button>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in ordersStore.orders"
          :key="order.id"
          class="bg-(--bg-primary) rounded-xl border border-(--border-light) p-6 hover:shadow-md transition-smooth cursor-pointer"
          @click="viewOrderDetails(order.id)"
        >
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-(--text-primary)">
                  Commande #{{ order.numero_commande }}
                </h3>
                <Badge :variant="getStatusVariant(order.statut)" size="sm">
                  {{ getStatusText(order.statut) }}
                </Badge>
              </div>
              <div class="flex items-center gap-4 text-sm text-(--text-muted)">
                <span class="flex items-center gap-1">
                  <Calendar class="w-4 h-4" />
                  {{ formatDate(order.cree_le) }}
                </span>
                <span class="flex items-center gap-1">
                  <Package class="w-4 h-4" />
                  {{ (order.articles_commande || []).length }} article{{ (order.articles_commande || []).length > 1 ? 's' : '' }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-sm text-(--text-muted)">Total</p>
                <p class="text-2xl font-bold text-(--color-primary)">
                  {{ formatPrice(parseFloat(order.montant_total)) }}
                </p>
              </div>
              <ChevronRight class="w-5 h-5 text-(--text-muted)" />
            </div>
          </div>

          <!-- Order Items Preview -->
          <div class="flex items-center gap-3 overflow-x-auto pb-2">
            <div
              v-for="item in (order.articles_commande || []).slice(0, 4)"
              :key="item.id"
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-(--bg-tertiary) border border-(--border-light)"
            >
              <img
                v-if="item.produit?.images_produits && item.produit.images_produits.length > 0"
                :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                :alt="item.produit?.nom || 'Produit'"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex items-center justify-center w-full h-full">
                <ImageOff class="w-6 h-6 text-(--text-muted)" />
              </div>
            </div>
            <div v-if="(order.articles_commande || []).length > 4" class="flex-shrink-0 w-16 h-16 rounded-lg bg-(--bg-tertiary) border border-(--border-light) flex items-center justify-center">
              <span class="text-sm font-medium text-(--text-muted)">+{{ (order.articles_commande || []).length - 4 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Modal
      v-model="showOrderDetails"
      title="Détails de la commande"
      size="xl"
    >
      <div v-if="ordersStore.currentOrder" class="space-y-6">
        <!-- Order Info -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-(--bg-secondary) rounded-xl">
          <div>
            <h3 class="text-xl font-bold text-(--text-primary) mb-2">
              Commande #{{ ordersStore.currentOrder.numero_commande }}
            </h3>
            <div class="flex flex-wrap items-center gap-4 text-sm text-(--text-muted)">
              <span class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                {{ formatDate(ordersStore.currentOrder.cree_le) }}
              </span>
              <Badge :variant="getStatusVariant(ordersStore.currentOrder.statut)">
                {{ getStatusText(ordersStore.currentOrder.statut) }}
              </Badge>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-(--text-muted) mb-1">Total</p>
            <p class="text-3xl font-bold text-(--color-primary)">
              {{ formatPrice(parseFloat(ordersStore.currentOrder.montant_total)) }}
            </p>
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h4 class="text-lg font-semibold text-(--text-primary) mb-4">Articles commandés</h4>
          <div class="space-y-3">
            <div
              v-for="item in (ordersStore.currentOrder.articles_commande || [])"
              :key="item.id"
              class="flex items-center gap-4 p-4 bg-(--bg-secondary) rounded-lg"
            >
              <div class="w-20 h-20 rounded-lg overflow-hidden bg-(--bg-tertiary) flex-shrink-0">
                <img
                  v-if="item.produit?.images_produits && item.produit.images_produits.length > 0"
                  :src="getImageUrl(item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image)"
                  :alt="item.produit?.nom || 'Produit'"
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex items-center justify-center w-full h-full">
                  <ImageOff class="w-8 h-8 text-(--text-muted)" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <h5 class="font-semibold text-(--text-primary) truncate">
                  {{ item.produit?.nom || 'Produit inconnu' }}
                </h5>
                <p v-if="item.produit?.categorie" class="text-sm text-(--text-muted)">
                  {{ item.produit.categorie.nom }}
                </p>
                <p class="text-sm text-(--text-muted) mt-1">
                  Quantité: {{ item.quantite }} × {{ formatPrice(parseFloat(item.prix_unitaire || '0')) }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-lg font-bold text-(--text-primary)">
                  {{ formatPrice(parseFloat(item.prix_unitaire || '0') * (item.quantite || 0)) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="p-6 bg-(--bg-secondary) rounded-xl">
          <h4 class="text-lg font-semibold text-(--text-primary) mb-4">Résumé</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-(--text-secondary)">
              <span>Sous-total</span>
              <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.sous_total)) }}</span>
            </div>
            <div class="flex justify-between text-(--text-secondary)">
              <span>Taxes</span>
              <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_taxe)) }}</span>
            </div>
            <div class="flex justify-between text-(--text-secondary)">
              <span>Livraison</span>
              <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_livraison)) }}</span>
            </div>
            <div v-if="parseFloat(ordersStore.currentOrder.montant_reduction) > 0" class="flex justify-between text-green-600">
              <span>Réduction</span>
              <span>-{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_reduction)) }}</span>
            </div>
            <div class="border-t border-(--border-light) pt-3 mt-3">
              <div class="flex justify-between text-lg font-bold text-(--text-primary)">
                <span>Total</span>
                <span class="text-(--color-primary)">{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_total)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { formatPrice } from '../utils/formatters'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Alert from '../components/ui/Alert.vue'
import Modal from '../components/ui/Modal.vue'
import {
  ShoppingBag,
  Package,
  Calendar,
  ChevronRight,
  ImageOff,
} from 'lucide-vue-next'

const ordersStore = useOrdersStore()
const showOrderDetails = ref(false)

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Mes commandes', to: '/orders' },
]

onMounted(() => {
  ordersStore.fetchOrders()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'EN_ATTENTE': 'En attente',
    'CONFIRMEE': 'Confirmée',
    'EN_PREPARATION': 'En préparation',
    'EXPEDIEE': 'Expédiée',
    'LIVREE': 'Livrée',
    'ANNULEE': 'Annulée',
  }
  return statusMap[status] || status
}

const getStatusVariant = (status: string): 'warning' | 'info' | 'primary' | 'success' | 'error' | 'secondary' => {
  const variantMap: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error' | 'secondary'> = {
    'EN_ATTENTE': 'warning',
    'CONFIRMEE': 'info',
    'EN_PREPARATION': 'primary',
    'EXPEDIEE': 'success',
    'LIVREE': 'success',
    'ANNULEE': 'error',
  }
  return variantMap[status] || 'secondary'
}

const viewOrderDetails = async (orderId: string) => {
  await ordersStore.fetchOrderById(orderId)
  showOrderDetails.value = true
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
