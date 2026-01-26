<template>
  <div id="app">
    <!-- Header/Navbar -->
    <header class="app-header">
      <div class="header-container">
        <div class="header-brand">
          <router-link to="/" class="brand-link">
            <img src="/images/logos.png" alt="Baobab Market" class="brand-logo" />
            <span class="brand-text">Baobab Market</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{{ t('nav.home') }}</span>
          </router-link>
          <router-link to="/products" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{{ t('nav.products') }}</span>
          </router-link>
        </nav>

        <!-- Right Section -->
        <div class="header-right">
          <!-- User Actions -->
          <div v-if="authStore.isAuthenticated" class="user-actions">
            <!-- Cart -->
            <router-link to="/cart" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.itemCount > 0" class="nav-badge">{{ cartStore.itemCount }}</span>
            </router-link>

            <!-- Wishlist -->
            <router-link to="/wishlist" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span v-if="wishlistStore.itemCount > 0" class="nav-badge">{{ wishlistStore.itemCount }}</span>
            </router-link>

            <!-- Notifications -->
            <button @click="toggleNotifications" class="nav-link notifications-btn" :class="{ active: showNotifications }">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 0110-4.472M15 17v5l5-5h-5zM9 15l6-6m0 0l-6 6m6-6H3" />
              </svg>
              <span v-if="notificationsStore.unreadCount > 0" class="nav-badge">{{ notificationsStore.unreadCount }}</span>
            </button>

            <!-- User Menu Dropdown -->
            <div class="user-menu">
              <button @click="toggleUserMenu" class="user-menu-btn" :class="{ active: showUserMenu }">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- User Dropdown Menu -->
              <div v-if="showUserMenu" class="user-dropdown">
                <router-link to="/orders" class="dropdown-item" @click="showUserMenu = false">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ t('nav.orders') }}</span>
                </router-link>
                <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ t('nav.profile') }}</span>
                </router-link>
                <hr class="dropdown-divider">
                <button @click="handleLogout" class="dropdown-item logout-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ t('nav.logout') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Auth Links for non-authenticated users -->
          <div v-if="!authStore.isAuthenticated" class="auth-links">
            <router-link to="/login" class="nav-link">
              <span>{{ t('nav.login') }}</span>
            </router-link>
            <router-link to="/register" class="btn-primary">
              <span>{{ t('nav.register') }}</span>
            </router-link>
          </div>

          <!-- Global Actions -->
          <div class="global-actions">
            <LanguageSelector />
            <ThemeToggle />
          </div>
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
          <span>{{ t('nav.home') }}</span>
        </router-link>
        <router-link to="/products" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>{{ t('nav.products') }}</span>
        </router-link>
        <!-- User Actions in Mobile Menu -->
        <div v-if="authStore.isAuthenticated" class="mobile-section">
          <div class="mobile-section-title">{{ t('nav.account') }}</div>
          <router-link to="/cart" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ t('nav.cart') }}</span>
            <span v-if="cartStore.itemCount > 0" class="mobile-nav-badge">{{ cartStore.itemCount }}</span>
          </router-link>
          <router-link to="/wishlist" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ t('nav.wishlist') }}</span>
            <span v-if="wishlistStore.itemCount > 0" class="mobile-nav-badge">{{ wishlistStore.itemCount }}</span>
          </router-link>
          <router-link to="/orders" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ t('nav.orders') }}</span>
          </router-link>
          <router-link to="/profile" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ t('nav.profile') }}</span>
          </router-link>
          <button @click="handleLogout" class="mobile-nav-link logout-mobile">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ t('nav.logout') }}</span>
          </button>
        </div>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{{ t('nav.login') }}</span>
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/register" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>{{ t('nav.register') }}</span>
        </router-link>
      </div>

      <!-- Notifications Dropdown -->
      <div v-if="showNotifications && authStore.isAuthenticated" class="notifications-dropdown">
        <div class="notifications-header">
          <h3>{{ t('nav.notifications') }}</h3>
          <button @click="showNotifications = false" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="notificationsStore.notifications.length === 0" class="no-notifications">
          <p>{{ t('common.noNotifications') }}</p>
        </div>
        <div v-else class="notifications-list">
          <div
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
          >
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-date">{{ formatDate(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from './composables/useI18n'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import { useNotificationsStore } from './stores/notifications'
import { useRouter } from 'vue-router'
import LanguageSelector from './components/ui/LanguageSelector.vue'
import ThemeToggle from './components/ui/ThemeToggle.vue'

const { t } = useI18n()

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationsStore = useNotificationsStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    // Mark all as read when opening
    notificationsStore.markAllAsRead()
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  // Close notifications dropdown when opening user menu
  if (showUserMenu.value) {
    showNotifications.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await notificationsStore.fetchNotifications()
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    const notificationsDropdown = document.querySelector('.notifications-dropdown')
    const userDropdown = document.querySelector('.user-dropdown')

    if (notificationsDropdown && !notificationsDropdown.contains(target) &&
        !target.closest('.notifications-btn')) {
      showNotifications.value = false
    }

    if (userDropdown && !userDropdown.contains(target) &&
        !target.closest('.user-menu-btn')) {
      showUserMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
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

.brand-logo {
  width: 58px;
  height: 48px;
  object-fit: contain;
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

/* Header Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

/* Auth Links */
.auth-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  color: var(--color-text-inverse);
}

/* Global Actions */
.global-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2);
  border: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-menu-btn:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.user-menu-btn.active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.user-menu-btn.active .dropdown-icon {
  transform: rotate(180deg);
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background-color: var(--color-bg-primary);
  border: var(--border-width) solid var(--color-border-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  margin-top: var(--spacing-1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.dropdown-divider {
  margin: var(--spacing-2) 0;
  border: none;
  border-top: var(--border-width) solid var(--color-border-light);
}

.logout-item {
  color: var(--color-error);
}

.logout-item:hover {
  background-color: var(--color-error-lighter);
  color: var(--color-error-dark);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-right {
    gap: var(--spacing-2);
  }

  .user-actions {
    gap: 0;
  }

  .nav-link span {
    display: none;
  }

  .nav-badge {
    position: absolute;
    top: -8px;
    right: -8px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: var(--spacing-3) var(--container-padding);
  }

  .desktop-nav {
    display: none !important;
  }

  .header-right {
    gap: var(--spacing-1);
  }

  .global-actions {
    display: none;
  }

  .user-dropdown {
    min-width: 180px;
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
  gap: var(--spacing-4);
}

.mobile-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.mobile-section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-2);
  padding: 0 var(--spacing-4);
}

.logout-mobile {
  color: var(--color-error);
  margin-top: var(--spacing-2);
}

.logout-mobile:hover {
  background-color: var(--color-error-lighter);
  color: var(--color-error-dark);
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

/* === NOTIFICATIONS === */

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 20px;
  width: 350px;
  max-height: 400px;
  background-color: var(--color-bg-primary);
  border: var(--border-width) solid var(--color-border-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border-bottom: var(--border-width) solid var(--color-border-light);
  background-color: var(--color-bg-secondary);
}

.notifications-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.close-btn:hover {
  background-color: var(--color-bg-hover);
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: var(--spacing-4);
  border-bottom: var(--border-width) solid var(--color-border-light);
  transition: background-color var(--transition-fast);
}

.notification-item:hover {
  background-color: var(--color-bg-hover);
}

.notification-item.unread {
  background-color: var(--color-primary-lighter);
  border-left: 3px solid var(--color-primary);
}

.notification-content h4 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.notification-content p {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.notification-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.no-notifications {
  padding: var(--spacing-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.notifications-btn.active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

/* === MAIN CONTENT === */

.app-main {
  flex: 1;
  width: 100%;
}
</style>