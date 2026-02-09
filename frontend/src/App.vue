<template>
  <div id="app" class="min-h-screen flex flex-col bg-(--bg-secondary)">
    <!-- Header/Navbar -->
    <header class="sticky top-0 z-40 bg-(--bg-primary) border-b border-(--border-light) backdrop-blur-lg bg-opacity-90 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <!-- Brand -->
          <router-link to="/" class="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <img src="/images/logos.png" alt="Baobab Market" class="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            <span class="text-lg sm:text-xl font-bold gradient-text hidden sm:block">Baobab Market</span>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1 flex-1 justify-center max-w-md mx-4">
            <router-link
              to="/"
              class="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
              active-class="!text-[var(--color-primary)] !bg-(--color-primary-100)"
            >
              <Home class="w-4 h-4" />
              <span>{{ t('nav.home') }}</span>
            </router-link>
            <router-link
              to="/products"
              class="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
              active-class="!text-[var(--color-primary)] !bg-(--color-primary-100)"
            >
              <Package class="w-4 h-4" />
              <span>{{ t('nav.products') }}</span>
            </router-link>
          </nav>

          <!-- Right Section -->
          <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <!-- Global Actions -->
            <div class="hidden lg:flex items-center gap-1">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            <!-- User Actions -->
            <div v-if="authStore.isAuthenticated()" class="flex items-center gap-0.5 sm:gap-1">
              <!-- Cart -->
              <router-link
                to="/cart"
                class="relative p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
                title="Panier"
              >
                <ShoppingCart class="w-5 h-5" />
                <Badge
                  v-if="cartStore.itemCount > 0"
                  variant="primary"
                  size="sm"
                  rounded
                  class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[1.25rem] h-5"
                >
                  {{ cartStore.itemCount }}
                </Badge>
              </router-link>

              <!-- Wishlist - Hidden on small screens -->
              <router-link
                to="/wishlist"
                class="hidden sm:flex relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
                title="Liste de souhaits"
              >
                <Heart class="w-5 h-5" />
                <Badge
                  v-if="wishlistStore.itemCount > 0"
                  variant="primary"
                  size="sm"
                  rounded
                  class="absolute -top-1 -right-1 min-w-[1.25rem] h-5"
                >
                  {{ wishlistStore.itemCount }}
                </Badge>
              </router-link>

              <!-- Notifications - Hidden on small screens -->
              <button
                @click.stop="toggleNotifications"
                class="hidden sm:flex relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
                :class="{ '!bg-(--color-primary-100) !text-[var(--color-primary)]': showNotifications }"
                title="Notifications"
              >
                <Bell class="w-5 h-5" />
                <Badge
                  v-if="notificationsStore.unreadCount > 0"
                  variant="error"
                  dot
                  class="absolute top-1.5 right-1.5"
                />
              </button>

              <!-- User Menu -->
              <div class="relative">
                <button
                  @click.stop="toggleUserMenu"
                  class="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
                  :class="{ '!bg-(--color-primary-100) !text-[var(--color-primary)]': showUserMenu }"
                  aria-label="Menu utilisateur"
                >
                  <Avatar :name="authStore.user?.prenom" size="sm" />
                  <ChevronDown class="w-3 h-3 sm:w-4 sm:h-4 hidden md:block" />
                </button>

                <!-- User Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-y-2"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 -translate-y-2"
                >
                  <div
                    v-if="showUserMenu"
                    ref="userMenu"
                    class="absolute right-0 mt-2 w-56 bg-(--bg-primary) rounded-xl shadow-xl border border-(--border-light) overflow-hidden"
                  >
                    <div class="p-3 border-b border-(--border-light) bg-(--bg-secondary)">
                      <p class="font-semibold text-[var(--text-primary)]">{{ authStore.user?.prenom }} {{ authStore.user?.nom }}</p>
                      <p class="text-sm text-[var(--text-muted)]">{{ authStore.user?.email }}</p>
                    </div>
                    <div class="py-2">
                      <!-- Lien Admin si l'utilisateur est admin -->
                      <router-link
                        v-if="authStore.isAdmin()"
                        to="/admin"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-(--color-primary-50) transition-smooth"
                        @click="showUserMenu = false"
                      >
                        <Settings class="w-4 h-4" />
                        <span>Administration</span>
                      </router-link>
                      <router-link
                        to="/orders"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
                        @click="showUserMenu = false"
                      >
                        <ShoppingBag class="w-4 h-4" />
                        <span>{{ t('nav.orders') }}</span>
                      </router-link>
                      <router-link
                        to="/profile"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
                        @click="showUserMenu = false"
                      >
                        <User class="w-4 h-4" />
                        <span>{{ t('nav.profile') }}</span>
                      </router-link>
                      <hr class="my-2 border-(--border-light)" />
                      <button
                        @click="handleLogout"
                        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-smooth"
                      >
                        <LogOut class="w-4 h-4" />
                        <span>{{ t('nav.logout') }}</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Auth Links -->
            <div v-else class="flex items-center gap-1 sm:gap-2">
              <router-link
                to="/login"
                class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth"
              >
                {{ t('nav.login') }}
              </router-link>
              <Button
                variant="primary"
                size="sm"
                @click="$router.push('/register')"
                class="text-xs sm:text-sm px-3 sm:px-4"
              >
                {{ t('nav.register') }}
              </Button>
            </div>

            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-(--bg-hover) transition-smooth"
            >
              <Menu v-if="!showMobileMenu" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="showMobileMenu"
        class="md:hidden fixed inset-x-0 top-14 sm:top-16 z-30 bg-(--bg-primary) border-b border-(--border-light) shadow-xl max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        <nav class="container mx-auto py-3 sm:py-4 space-y-0.5 sm:space-y-1">
          <router-link
            to="/"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
            active-class="!bg-(--color-primary-100) !text-[var(--color-primary)]"
            @click="showMobileMenu = false"
          >
            <Home class="w-5 h-5" />
            <span class="font-medium">{{ t('nav.home') }}</span>
          </router-link>
          <router-link
            to="/products"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
            active-class="!bg-(--color-primary-100) !text-[var(--color-primary)]"
            @click="showMobileMenu = false"
          >
            <Package class="w-5 h-5" />
            <span class="font-medium">{{ t('nav.products') }}</span>
          </router-link>

          <template v-if="authStore.isAuthenticated()">
            <hr class="my-2 border-(--border-light)" />
            <router-link
              to="/cart"
              class="flex items-center justify-between px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center gap-3">
                <ShoppingCart class="w-5 h-5" />
                <span class="font-medium">{{ t('nav.cart') }}</span>
              </div>
              <Badge v-if="cartStore.itemCount > 0" variant="primary" size="sm">
                {{ cartStore.itemCount }}
              </Badge>
            </router-link>
            <router-link
              to="/wishlist"
              class="flex items-center justify-between px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center gap-3">
                <Heart class="w-5 h-5" />
                <span class="font-medium">{{ t('nav.wishlist') }}</span>
              </div>
              <Badge v-if="wishlistStore.itemCount > 0" variant="primary" size="sm">
                {{ wishlistStore.itemCount }}
              </Badge>
            </router-link>
            <router-link
              to="/orders"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
              @click="showMobileMenu = false"
            >
              <ShoppingBag class="w-5 h-5" />
              <span class="font-medium">{{ t('nav.orders') }}</span>
            </router-link>
            <router-link
              to="/profile"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
              @click="showMobileMenu = false"
            >
              <User class="w-5 h-5" />
              <span class="font-medium">{{ t('nav.profile') }}</span>
            </router-link>
          </template>

          <template v-else>
            <hr class="my-2 border-(--border-light)" />
            <router-link
              to="/login"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] transition-smooth"
              @click="showMobileMenu = false"
            >
              <LogIn class="w-5 h-5" />
              <span class="font-medium">{{ t('nav.login') }}</span>
            </router-link>
            <router-link
              to="/register"
              class="flex items-center gap-3 px-4 py-3 rounded-lg bg-(--color-primary) text-white font-medium"
              @click="showMobileMenu = false"
            >
              <UserPlus class="w-5 h-5" />
              <span>{{ t('nav.register') }}</span>
            </router-link>
          </template>

          <hr class="my-2 border-(--border-light)" />
          <div class="px-4 py-2 space-y-2">
            <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Préférences</p>
            <div class="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </Transition>

    <!-- Notifications Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="showNotifications"
        ref="notificationsMenu"
        class="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-(--bg-primary) rounded-xl shadow-2xl border border-(--border-light) overflow-hidden z-50"
      >
        <div class="flex items-center justify-between p-4 border-b border-(--border-light) bg-(--bg-secondary)">
          <h3 class="font-semibold text-[var(--text-primary)]">Notifications</h3>
          <button
            @click="showNotifications = false"
            class="p-1 rounded-lg hover:bg-(--bg-hover) transition-smooth"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        
        <div class="max-h-96 overflow-y-auto scrollbar-hidden">
          <div
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="p-4 border-b border-(--border-light) hover:bg-(--bg-hover) transition-smooth cursor-pointer"
            :class="{ '!bg-(--color-primary-50)': !notification.read }"
          >
            <h4 class="font-medium text-[var(--text-primary)] text-sm">{{ notification.title }}</h4>
            <p class="text-sm text-[var(--text-secondary)] mt-1">{{ notification.message }}</p>
            <p class="text-xs text-[var(--text-muted)] mt-2">{{ formatDate(notification.createdAt) }}</p>
          </div>
          
          <div v-if="notificationsStore.notifications.length === 0" class="p-8 text-center">
            <Bell class="w-12 h-12 mx-auto text-[var(--text-muted)] mb-2" />
            <p class="text-[var(--text-muted)]">Aucune notification</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import { useNotificationsStore } from './stores/notifications'
import { useI18n } from './composables/useI18n'
import Button from './components/ui/Button.vue'
import Badge from './components/ui/Badge.vue'
import Avatar from './components/ui/Avatar.vue'
import LanguageSelector from './components/ui/LanguageSelector.vue'
import CurrencySelector from './components/ui/CurrencySelector.vue'
import ThemeToggle from './components/ui/ThemeToggle.vue'
import Footer from './components/shared/Footer.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import {
  Home,
  Package,
  ShoppingCart,
  Heart,
  Bell,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  Settings,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)

const userMenu = ref<HTMLElement>()
const notificationsMenu = ref<HTMLElement>()

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showUserMenu.value = false
    showNotifications.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showMobileMenu.value = false
    showNotifications.value = false
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showMobileMenu.value = false
    showUserMenu.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  router.push('/login')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Handle click outside for dropdowns
const handleClickOutside = (event: Event) => {
  const target = event.target as Node

  // Close user menu if clicked outside
  if (userMenu.value && !userMenu.value.contains(target)) {
    showUserMenu.value = false
  }

  // Close notifications if clicked outside
  if (notificationsMenu.value && !notificationsMenu.value.contains(target)) {
    showNotifications.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
