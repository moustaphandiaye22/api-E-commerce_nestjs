<template>
  <div class="cart-page">
    <div class="container">
      <h1>Mon Panier</h1>

      <!-- Loading State -->
      <div v-if="cartStore.loading" class="loading">
        Chargement du panier...
      </div>

      <!-- Error State -->
      <div v-else-if="cartStore.error" class="error-message">
        {{ cartStore.error }}
        <button @click="cartStore.fetchCart()" class="btn-retry">
          Réessayer
        </button>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!cartStore.cart || cartStore.cart.articles_panier.length === 0" class="empty-cart">
        <div class="empty-cart-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits et ajoutez-les à votre panier</p>
        <router-link to="/products" class="btn-primary">
          Voir les produits
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cartStore.cart.articles_panier"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-image">
              <img
                v-if="item.produit.images_produits && item.produit.images_produits.length > 0"
                :src="item.produit.images_produits.find(img => img.est_principale)?.url_image || item.produit.images_produits[0]?.url_image"
                :alt="item.produit.nom"
              />
              <div v-else class="no-image">Pas d'image</div>
            </div>

            <div class="item-details">
              <h3 class="item-title">{{ item.produit.nom }}</h3>
              <p class="item-price">{{ formatPrice(parseFloat(item.prix_unitaire)) }} €</p>
              <div class="item-category" v-if="item.produit.categorie">
                {{ item.produit.categorie.nom }}
              </div>
            </div>

            <div class="item-quantity">
              <button
                @click="updateQuantity(item.id, item.quantite - 1)"
                :disabled="item.quantite <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <span class="quantity-value">{{ item.quantite }}</span>
              <button
                @click="updateQuantity(item.id, item.quantite + 1)"
                class="quantity-btn"
              >
                +
              </button>
            </div>

            <div class="item-total">
              {{ formatPrice(parseFloat(item.prix_unitaire) * item.quantite) }} €
            </div>

            <button
              @click="removeItem(item.id)"
              class="remove-btn"
              title="Retirer du panier"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-content">
            <h3>Résumé de la commande</h3>
            <div class="summary-row">
              <span>Sous-total ({{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }})</span>
              <span>{{ formatPrice(cartStore.totalAmount) }} €</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span>Calculé à l'étape suivante</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(cartStore.totalAmount) }} €</span>
            </div>
            <button class="btn-checkout" @click="proceedToCheckout">
              Procéder au paiement
            </button>
            <button class="btn-clear" @click="clearCart">
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  cartStore.fetchCart()
})

const updateQuantity = async (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return
  await cartStore.updateItem(itemId, newQuantity)
}

const removeItem = async (itemId: string) => {
  await cartStore.removeItem(itemId)
}

const clearCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    await cartStore.clearCart()
  }
}

const proceedToCheckout = () => {
  // TODO: Navigate to checkout page
  alert('Fonctionnalité de paiement à implémenter')
}
</script>

<style scoped>
@import '../styles/design-system.css';

.cart-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-4) 0;
}

.container {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.cart-page h1 {
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

.empty-cart {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
}

.empty-cart-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-6);
  color: var(--color-text-tertiary);
}

.empty-cart-icon svg {
  width: 100%;
  height: 100%;
}

.empty-cart h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.empty-cart p {
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-8);
  align-items: start;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-bottom: var(--border-width) solid var(--color-border-light);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: var(--spacing-3);
  }

  .item-quantity, .item-total, .remove-btn {
    grid-column: span 2;
    justify-self: center;
  }
}

.item-image {
  width: 80px;
  height: 80px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.item-details {
  min-width: 0;
}

.item-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.item-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-1);
}

.item-category {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: var(--border-width) solid var(--color-border-medium);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 40px;
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.item-total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: var(--color-error);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.remove-btn:hover {
  background-color: var(--color-error-light);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.cart-summary {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: var(--spacing-4);
}

.summary-content {
  padding: var(--spacing-6);
}

.summary-content h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.summary-row.total {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
}

.summary-divider {
  height: var(--border-width);
  background-color: var(--color-border-light);
  margin: var(--spacing-4) 0;
}

.btn-checkout {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-success);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  margin-bottom: var(--spacing-3);
  transition: background-color var(--transition-fast);
}

.btn-checkout:hover {
  background-color: var(--color-success);
  opacity: 0.9;
}

.btn-clear {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-4);
  background-color: transparent;
  color: var(--color-error);
  border: var(--border-width) solid var(--color-error);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-clear:hover {
  background-color: var(--color-error-light);
}
</style>