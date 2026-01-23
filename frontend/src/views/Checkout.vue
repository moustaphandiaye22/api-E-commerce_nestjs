<template>
  <div class="checkout-page">
    <div class="container">
      <h1>Finaliser ma commande</h1>

      <div v-if="cartStore.loading" class="loading">
        Chargement du panier...
      </div>

      <div v-else-if="!cartStore.cart || cartStore.cart.articles_panier.length === 0" class="empty-cart">
        <p>Votre panier est vide. <router-link to="/products">Continuer vos achats</router-link></p>
      </div>

      <div v-else class="checkout-content">
        <form @submit.prevent="handleSubmit" class="checkout-form">
          <!-- Shipping Address -->
          <div class="form-section">
            <h2>Adresse de livraison</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="shipping-firstname">Prénom *</label>
                <input
                  id="shipping-firstname"
                  v-model="shippingAddress.prenom"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="shipping-lastname">Nom *</label>
                <input
                  id="shipping-lastname"
                  v-model="shippingAddress.nom"
                  type="text"
                  required
                />
              </div>
              <div class="form-group full-width">
                <label for="shipping-street">Rue *</label>
                <input
                  id="shipping-street"
                  v-model="shippingAddress.rue"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="shipping-postal">Code postal *</label>
                <input
                  id="shipping-postal"
                  v-model="shippingAddress.code_postal"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="shipping-city">Ville *</label>
                <input
                  id="shipping-city"
                  v-model="shippingAddress.ville"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="shipping-country">Pays *</label>
                <select id="shipping-country" v-model="shippingAddress.pays" required>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Billing Address -->
          <div class="form-section">
            <div class="checkbox-group">
              <input
                id="same-address"
                v-model="sameAddress"
                type="checkbox"
                @change="toggleSameAddress"
              />
              <label for="same-address">Adresse de facturation identique</label>
            </div>

            <div v-if="!sameAddress">
              <h2>Adresse de facturation</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="billing-firstname">Prénom *</label>
                  <input
                    id="billing-firstname"
                    v-model="billingAddress.prenom"
                    type="text"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing-lastname">Nom *</label>
                  <input
                    id="billing-lastname"
                    v-model="billingAddress.nom"
                    type="text"
                    required
                  />
                </div>
                <div class="form-group full-width">
                  <label for="billing-street">Rue *</label>
                  <input
                    id="billing-street"
                    v-model="billingAddress.rue"
                    type="text"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing-postal">Code postal *</label>
                  <input
                    id="billing-postal"
                    v-model="billingAddress.code_postal"
                    type="text"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing-city">Ville *</label>
                  <input
                    id="billing-city"
                    v-model="billingAddress.ville"
                    type="text"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing-country">Pays *</label>
                  <select id="billing-country" v-model="billingAddress.pays" required>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-section">
            <h2>Méthode de paiement</h2>
            <div class="payment-methods">
              <div class="payment-method">
                <input
                  id="stripe"
                  v-model="paymentMethod"
                  type="radio"
                  value="stripe"
                  required
                />
                <label for="stripe">
                  <div class="payment-info">
                    <div class="payment-name">Carte bancaire</div>
                    <div class="payment-description">Visa, MasterCard, American Express</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <h2>Résumé de la commande</h2>
            <div class="summary-items">
              <div
                v-for="item in cartStore.cart.articles_panier"
                :key="item.id"
                class="summary-item"
              >
                <div class="item-info">
                  <span class="item-name">{{ item.produit.nom }}</span>
                  <span class="item-quantity">x{{ item.quantite }}</span>
                </div>
                <span class="item-price">{{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }} €</span>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ formatPrice(cartStore.totalAmount) }} €</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span>{{ formatPrice(shippingCost) }} €</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(totalAmount) }} €</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button
              type="submit"
              :disabled="ordersStore.loading"
              class="btn-submit"
            >
              {{ ordersStore.loading ? 'Traitement...' : `Payer ${formatPrice(totalAmount)} €` }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { formatPrice } from '../utils/formatters'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const router = useRouter()

// Form data
const shippingAddress = ref({
  prenom: '',
  nom: '',
  rue: '',
  code_postal: '',
  ville: '',
  pays: 'France'
})

const billingAddress = ref({
  prenom: '',
  nom: '',
  rue: '',
  code_postal: '',
  ville: '',
  pays: 'France'
})

const sameAddress = ref(true)
const paymentMethod = ref('stripe')

// Constants
const shippingCost = 5.99

const totalAmount = computed(() => cartStore.finalAmount + shippingCost)

const toggleSameAddress = () => {
  if (sameAddress.value) {
    billingAddress.value = { ...shippingAddress.value }
  }
}

const handleSubmit = async () => {
  try {
    const orderData = {
      shippingAddress: shippingAddress.value,
      billingAddress: sameAddress.value ? shippingAddress.value : billingAddress.value
    }

    const order = await ordersStore.createOrder(orderData)

    if (order) {
      // TODO: Implement Stripe payment flow
      // For now, just clear cart and redirect to orders
      await cartStore.clearCart()
      router.push('/orders')
    }
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

onMounted(() => {
  if (!cartStore.cart) {
    cartStore.fetchCart()
  }
})
</script>

<style scoped>
@import '../styles/design-system.css';

.checkout-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-4) 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.checkout-page h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-8);
  text-align: center;
}

.loading, .empty-cart {
  text-align: center;
  padding: var(--spacing-12);
  font-size: var(--font-size-lg);
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-8);
  align-items: start;
}

.checkout-form {
  display: grid;
  gap: var(--spacing-8);
}

.form-section {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.form-section h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.form-group {
  display: grid;
  gap: var(--spacing-2);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-group input,
.form-group select {
  padding: var(--spacing-3);
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
}

.checkbox-group input {
  width: auto;
  margin: 0;
}

.payment-methods {
  display: grid;
  gap: var(--spacing-3);
}

.payment-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: var(--border-width) solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.payment-method:hover {
  border-color: var(--color-primary);
}

.payment-method input {
  width: auto;
  margin: 0;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.payment-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.order-summary {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: var(--spacing-4);
}

.order-summary h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
}

.summary-items {
  margin-bottom: var(--spacing-4);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
  border-bottom: var(--border-width) solid var(--color-border-light);
}

.summary-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.item-quantity {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.item-price {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.summary-divider {
  height: var(--border-width);
  background-color: var(--color-border-light);
  margin: var(--spacing-4) 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.summary-row.total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  padding-top: var(--spacing-4);
  border-top: var(--border-width) solid var(--color-border-light);
}

.form-actions {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.btn-submit {
  width: 100%;
  padding: var(--spacing-4);
  background-color: var(--color-success);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-success);
  opacity: 0.9;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }
}
</style>