<template>
  <div class="admin-orders">
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des commandes</h1>
        <p class="text-[var(--text-muted)]">Suivi et gestion des commandes</p>
      </div>
    </div>

    <div class="orders-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Produits</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="loading-cell">Chargement...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="7" class="empty-cell">
              <ShoppingBag class="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p>Aucune commande</p>
            </td>
          </tr>
<tr v-for="order in orders" :key="order.id">
            <td class="order-number">#{{ order.numero_commande }}</td>
            <td>
              <div class="customer-info">
                <p class="customer-name">{{ getClientName(order) }}</p>
                <p class="customer-email" v-if="order.utilisateur?.email">{{ order.utilisateur.email }}</p>
              </div>
            </td>
            <td>{{ order.articles_commande?.length || 0 }} produit(s)</td>
            <td class="total">{{ formatPrice(parseFloat(order.montant_total)) }}</td>
            <td>
              <select
                :value="order.statut"
                @change="updateStatus(order, $event)"
                class="status-select"
              >
                <option value="EN_ATTENTE">En attente</option>
                <option value="CONFIRME">Confirmée</option>
                <option value="EXPEDIE">Expédiée</option>
                <option value="LIVRE">Livrée</option>
                <option value="ANNULE">Annulée</option>
              </select>
            </td>
            <td>{{ formatDate(order.cree_le) }}</td>
            <td>
              <button @click="viewOrder(order)" class="action-btn" title="Voir détails">
                <Eye class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

<!-- Order Detail Modal -->
    <Modal :model-value="showDetailModal" @update:model-value="showDetailModal = $event">
      <div class="modal-content detail-modal">
        <h3>Commande #{{ selectedOrder?.numero_commande }}</h3>
        <div v-if="selectedOrder" class="order-details">
          <div class="detail-section">
            <h4>Client</h4>
            <p>{{ getClientName(selectedOrder) }}</p>
            <p v-if="selectedOrder.utilisateur?.email">{{ selectedOrder.utilisateur.email }}</p>
          </div>
          <div class="detail-section">
            <h4>Adresse de livraison</h4>
            <p>{{ selectedOrder.adresse_livraison?.rue }}</p>
            <p>{{ selectedOrder.adresse_livraison?.code_postal }}, {{ selectedOrder.adresse_livraison?.ville }}</p>
          </div>
          <div class="detail-section">
            <h4>Produits</h4>
            <div v-for="item in selectedOrder.articles_commande" :key="item.id" class="order-item">
              <span>{{ item.produit?.nom }} x {{ item.quantite }}</span>
              <span class="item-price">{{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }}</span>
            </div>
          </div>
          <div class="detail-total">
            <span>Total</span>
            <span class="total-price">{{ formatPrice(parseFloat(selectedOrder.montant_total)) }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <Button variant="secondary" @click="showDetailModal = false">Fermer</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ordersAPI } from '../../api/orders'
import type { Order } from '../../types/api'
import { formatPrice } from '../../utils/formatters'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import { ShoppingBag, Eye } from 'lucide-vue-next'

// Extended order type with user info for admin
interface OrderWithUser extends Order {
  utilisateur?: {
    id: string
    prenom: string
    nom: string
    email: string
  }
}

const orders = ref<OrderWithUser[]>([])
const loading = ref(true)
const showDetailModal = ref(false)
const selectedOrder = ref<OrderWithUser | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const loadOrders = async () => {
  loading.value = true
  try {
    const response = await ordersAPI.getAllAdmin()
    orders.value = response.data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (order: Order, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value as Order['statut']
  
  try {
    await ordersAPI.updateOrder(order.id, { statut: newStatus })
    order.statut = newStatus
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const viewOrder = (order: OrderWithUser) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

// Helper to get client name
const getClientName = (order: OrderWithUser): string => {
  if (order.utilisateur) {
    return `${order.utilisateur.prenom} ${order.utilisateur.nom}`
  }
  return 'Client'
}

onMounted(loadOrders)
</script>

<style scoped>
.admin-orders {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.orders-table-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.order-number {
  font-family: monospace;
  font-weight: 600;
}

.customer-info .customer-name {
  font-weight: 500;
  color: var(--text-primary);
}

.customer-info .customer-email {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.total {
  font-weight: 600;
  color: var(--color-primary);
}

.status-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--bg-hover);
}

.modal-content {
  padding: 1.5rem;
  min-width: 500px;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-light);
}

.item-price {
  font-weight: 500;
}

.detail-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.total-price {
  color: var(--color-primary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem !important;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .orders-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 800px;
  }

  .modal-content {
    min-width: auto;
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.125rem;
  }

  .admin-orders {
    max-width: 100%;
  }

  .modal-content {
    max-width: 100%;
    padding: 1rem;
  }

  .order-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-total {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

