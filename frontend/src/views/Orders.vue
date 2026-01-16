<template>
  <div class="orders-page">
    <div class="container">
      <h1>Mes Commandes</h1>

      <!-- Loading State -->
      <div v-if="ordersStore.loading" class="loading">
        Chargement des commandes...
      </div>

      <!-- Error State -->
      <div v-else-if="ordersStore.error" class="error-message">
        {{ ordersStore.error }}
        <button @click="ordersStore.fetchOrders()" class="btn-retry">
          Réessayer
        </button>
      </div>

      <!-- Empty Orders -->
      <div v-else-if="ordersStore.orders.length === 0" class="empty-orders">
        <div class="empty-orders-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2>Vous n'avez pas encore de commandes</h2>
        <p>Découvrez nos produits et passez votre première commande</p>
        <router-link to="/products" class="btn-primary">
          Voir les produits
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-content">
        <div class="orders-list">
          <div
            v-for="order in ordersStore.orders"
            :key="order.id"
            class="order-card"
            @click="viewOrderDetails(order.id)"
          >
            <div class="order-header">
              <div class="order-info">
                <h3 class="order-number">Commande #{{ order.numero_commande }}</h3>
                <p class="order-date">{{ formatDate(order.cree_le) }}</p>
              </div>
              <div class="order-status" :class="getStatusClass(order.statut)">
                {{ getStatusText(order.statut) }}
              </div>
            </div>

            <div class="order-items">
              <div class="order-item" v-for="item in order.articles_commande.slice(0, 3)" :key="item.id">
                <div class="item-image">
                  <img
                    v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                    :src="item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image"
                    :alt="item.produit.nom"
                  />
                  <div v-else class="no-image">Pas d'image</div>
                </div>
                <div class="item-details">
                  <p class="item-name">{{ item.produit.nom }}</p>
                  <p class="item-quantity">Qté: {{ item.quantite }}</p>
                </div>
              </div>
              <div v-if="order.articles_commande.length > 3" class="more-items">
                +{{ order.articles_commande.length - 3 }} autres
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span class="total-label">Total:</span>
                <span class="total-amount">{{ formatPrice(parseFloat(order.montant_total)) }} €</span>
              </div>
              <button class="btn-view-details">
                Voir détails
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="showOrderDetails && ordersStore.currentOrder" class="modal-overlay" @click="closeOrderDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Détails de la commande #{{ ordersStore.currentOrder.numero_commande }}</h2>
            <button @click="closeOrderDetails" class="modal-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="order-details-grid">
              <div class="detail-section">
                <h3>Informations de commande</h3>
                <div class="detail-row">
                  <span>Date:</span>
                  <span>{{ formatDate(ordersStore.currentOrder.cree_le) }}</span>
                </div>
                <div class="detail-row">
                  <span>Statut:</span>
                  <span :class="getStatusClass(ordersStore.currentOrder.statut)">
                    {{ getStatusText(ordersStore.currentOrder.statut) }}
                  </span>
                </div>
                <div class="detail-row">
                  <span>Numéro:</span>
                  <span>{{ ordersStore.currentOrder.numero_commande }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3>Articles commandés</h3>
                <div class="order-items-detailed">
                  <div
                    v-for="item in ordersStore.currentOrder.articles_commande"
                    :key="item.id"
                    class="detailed-item"
                  >
                    <div class="item-image">
                      <img
                        v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                        :src="item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image"
                        :alt="item.produit.nom"
                      />
                      <div v-else class="no-image">Pas d'image</div>
                    </div>
                    <div class="item-info">
                      <h4>{{ item.produit.nom }}</h4>
                      <p class="item-category" v-if="item.produit.categorie">
                        {{ item.produit.categorie.nom }}
                      </p>
                      <p class="item-quantity">Quantité: {{ item.quantite }}</p>
                      <p class="item-price">{{ formatPrice(parseFloat(item.prix_unitaire)) }} €</p>
                    </div>
                    <div class="item-total">
                      {{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }} €
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>Résumé</h3>
                <div class="summary-row">
                  <span>Sous-total:</span>
                  <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.sous_total)) }} €</span>
                </div>
                <div class="summary-row">
                  <span>Taxes:</span>
                  <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_taxe)) }} €</span>
                </div>
                <div class="summary-row">
                  <span>Livraison:</span>
                  <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_livraison)) }} €</span>
                </div>
                <div class="summary-row">
                  <span>Réduction:</span>
                  <span>-{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_reduction)) }} €</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>{{ formatPrice(parseFloat(ordersStore.currentOrder.montant_total)) }} €</span>
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
import { useOrdersStore } from '../stores/orders'
import { formatPrice } from '../utils/formatters'

const ordersStore = useOrdersStore()
const showOrderDetails = ref(false)

onMounted(() => {
  ordersStore.fetchOrders()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'EN_ATTENTE': 'En attente',
    'CONFIRMEE': 'Confirmée',
    'EN_PREPARATION': 'En préparation',
    'EXPEDIEE': 'Expédiée',
    'LIVREE': 'Livrée',
    'ANNULEE': 'Annulée'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'EN_ATTENTE': 'status-pending',
    'CONFIRMEE': 'status-confirmed',
    'EN_PREPARATION': 'status-preparing',
    'EXPEDIEE': 'status-shipped',
    'LIVREE': 'status-delivered',
    'ANNULEE': 'status-cancelled'
  }
  return classMap[status] || 'status-default'
}

const viewOrderDetails = async (orderId: string) => {
  await ordersStore.fetchOrderById(orderId)
  showOrderDetails.value = true
}

const closeOrderDetails = () => {
  showOrderDetails.value = false
  ordersStore.currentOrder = null
}
</script>

<style scoped>
@import '../styles/design-system.css';

.orders-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-4) 0;
}

.container {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.orders-page h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-8);
  text-align: center;
}

.loading, .error-message {
  text-align: center;
  padding: var(--spacing-12);
  font-size: var(--font-size-lg);
}

.error-message {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-6);
}

.btn-retry {
  margin-top: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-fast);
}

.btn-retry:hover {
  background-color: var(--color-primary-dark);
}

.empty-orders {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
}

.empty-orders-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-6);
  color: var(--color-text-tertiary);
}

.empty-orders-icon svg {
  width: 100%;
  height: 100%;
}

.empty-orders h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.empty-orders p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-6);
}

.btn-primary {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.orders-content {
  display: grid;
  gap: var(--spacing-6);
}

.orders-list {
  display: grid;
  gap: var(--spacing-4);
}

.order-card {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.order-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.order-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.order-date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.order-status {
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.status-pending { background-color: var(--color-warning-light); color: var(--color-warning); }
.status-confirmed { background-color: var(--color-info-light); color: var(--color-info); }
.status-preparing { background-color: var(--color-primary-lighter); color: var(--color-primary); }
.status-shipped { background-color: var(--color-success-light); color: var(--color-success); }
.status-delivered { background-color: var(--color-success-light); color: var(--color-success); }
.status-cancelled { background-color: var(--color-error-light); color: var(--color-error); }

.order-items {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  flex-wrap: wrap;
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  flex: 1;
  min-width: 200px;
}

.item-image {
  width: 40px;
  height: 40px;
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-quantity {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.more-items {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.total-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.total-amount {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.btn-view-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-view-details:hover {
  background-color: var(--color-primary-dark);
}

.btn-view-details svg {
  width: 16px;
  height: 16px;
}

/* Modal Styles */
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: var(--border-width) solid var(--color-border-light);
}

.modal-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.modal-close:hover {
  background-color: var(--color-bg-hover);
}

.modal-body {
  padding: var(--spacing-6);
}

.order-details-grid {
  display: grid;
  gap: var(--spacing-6);
}

.detail-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
  border-bottom: var(--border-width) solid var(--color-border-light);
}

.detail-row:last-child {
  border-bottom: none;
}

.order-items-detailed {
  display: grid;
  gap: var(--spacing-4);
}

.detailed-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: var(--spacing-4);
  padding: var(--spacing-3);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  align-items: center;
}

.detailed-item .item-image {
  width: 60px;
  height: 60px;
}

.detailed-item .item-info h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.detailed-item .item-category {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-1);
}

.detailed-item .item-quantity,
.detailed-item .item-price {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.item-total {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
}

.summary-row.total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  padding-top: var(--spacing-4);
  border-top: var(--border-width) solid var(--color-border-light);
}

.summary-divider {
  height: var(--border-width);
  background-color: var(--color-border-light);
  margin: var(--spacing-2) 0;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .order-items {
    flex-direction: column;
  }

  .order-item {
    min-width: auto;
  }

  .order-footer {
    flex-direction: column;
    gap: var(--spacing-3);
    align-items: stretch;
  }

  .detailed-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .detailed-item .item-image {
    justify-self: center;
  }
}
</style>