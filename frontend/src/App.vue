<template>
  <div id="app">
    <!-- Header/Navbar -->
    <header v-if="authStore.isAuthenticated" class="app-header">
      <div class="header-container">
        <div class="header-brand">
          <router-link to="/" class="brand-link">
            <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="brand-text">ShopHub</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Accueil</span>
          </router-link>
          <router-link to="/products" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Produits</span>
          </router-link>
          <router-link to="/cart" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Panier</span>
            <span v-if="cartStore.itemCount > 0" class="nav-badge">{{ cartStore.itemCount }}</span>
          </router-link>
          <router-link to="/wishlist" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Favoris</span>
            <span v-if="wishlistStore.itemCount > 0" class="nav-badge">{{ wishlistStore.itemCount }}</span>
          </router-link>
          <router-link to="/orders" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Commandes</span>
          </router-link>
          <router-link to="/profile" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profil</span>
          </router-link>
        </nav>

        <div class="header-actions">
          <button @click="handleLogout" class="btn-ghost">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="btn-text">Déconnexion</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn">
          <svg v-if="!mobileMenuOpen" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Accueil</span>
        </router-link>
        <router-link to="/products" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Produits</span>
        </router-link>
        <router-link to="/cart" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Panier</span>
          <span v-if="cartStore.itemCount > 0" class="mobile-nav-badge">{{ cartStore.itemCount }}</span>
        </router-link>
        <router-link to="/wishlist" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Favoris</span>
          <span v-if="wishlistStore.itemCount > 0" class="mobile-nav-badge">{{ wishlistStore.itemCount }}</span>
        </router-link>
        <router-link to="/orders" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Commandes</span>
        </router-link>
        <router-link to="/profile" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profil</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
@import './styles/design-system.css';

/* === APP LAYOUT === */

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === HEADER === */

.app-header {
  background-color: var(--color-bg-primary);
  border-bottom: var(--border-width) solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: var(--max-width-2xl);
  margin: 0 auto;
  padding: var(--spacing-4) var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-6);
}

/* Brand */
.header-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  transition: color var(--transition-fast);
}

.brand-link:hover {
  color: var(--color-primary);
}

.brand-icon {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.brand-text {
  display: none;
}

@media (min-width: 640px) {
  .brand-text {
    display: inline;
  }
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
  gap: var(--spacing-2);
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.nav-link.router-link-active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-badge {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  margin-left: var(--spacing-1);
  min-width: 18px;
  text-align: center;
}

/* Header Actions */
.header-actions {
  display: none;
}

@media (min-width: 768px) {
  .header-actions {
    display: flex;
    gap: var(--spacing-2);
  }
}

.btn-ghost {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-ghost:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-error);
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-text {
  display: none;
}

@media (min-width: 1024px) {
  .btn-text {
    display: inline;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  border: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-menu-btn:hover {
  background-color: var(--color-bg-hover);
}

@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* Mobile Navigation */
.mobile-nav {
  border-top: var(--border-width) solid var(--color-border-light);
  padding: var(--spacing-4) var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.mobile-nav-link:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.mobile-nav-link.router-link-active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.mobile-nav-badge {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  margin-left: var(--spacing-2);
  min-width: 18px;
  text-align: center;
}

/* === MAIN CONTENT === */

.app-main {
  flex: 1;
  width: 100%;
}
</style>