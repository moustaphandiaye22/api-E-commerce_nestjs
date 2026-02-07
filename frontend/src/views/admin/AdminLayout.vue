<template>
  <div class="admin-layout">
    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      class="sidebar-overlay" 
      @click="closeSidebar"
    ></div>

    <!-- Admin Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <router-link to="/admin" class="admin-logo">
          <img src="/images/logos.png" alt="Baobab Market" class="h-8 w-8" />
          <span class="font-bold text-lg">Baobab Admin</span>
        </router-link>
        <button class="sidebar-close" @click="closeSidebar">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <p class="nav-section-title">Principal</p>
          <router-link
            to="/admin"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminDashboard' }"
            @click="closeSidebar"
          >
            <LayoutDashboard class="w-5 h-5" />
            <span>Dashboard</span>
          </router-link>
        </div>

        <div class="nav-section">
          <p class="nav-section-title">Catalogue</p>
          <router-link
            to="/admin/products"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminProducts' }"
            @click="closeSidebar"
          >
            <Package class="w-5 h-5" />
            <span>Produits</span>
          </router-link>
          <router-link
            to="/admin/categories"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminCategories' }"
            @click="closeSidebar"
          >
            <FolderTree class="w-5 h-5" />
            <span>Catégories</span>
          </router-link>
        </div>

        <div class="nav-section">
          <p class="nav-section-title">Commercial</p>
          <router-link
            to="/admin/orders"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminOrders' }"
            @click="closeSidebar"
          >
            <ShoppingBag class="w-5 h-5" />
            <span>Commandes</span>
          </router-link>
          <router-link
            to="/admin/coupons"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminCoupons' }"
            @click="closeSidebar"
          >
            <Tag class="w-5 h-5" />
            <span>Coupons</span>
          </router-link>
        </div>

        <div class="nav-section">
          <p class="nav-section-title">Utilisateurs</p>
          <router-link
            to="/admin/users"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminUsers' }"
            @click="closeSidebar"
          >
            <Users class="w-5 h-5" />
            <span>Utilisateurs</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" class="nav-item" @click="closeSidebar">
          <ArrowLeft class="w-5 h-5" />
          <span>Retour au site</span>
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <Menu class="w-6 h-6" />
          </button>
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="flex items-center gap-4">
            <span class="text-sm text-[var(--text-muted)] hidden-mobile">
              Connecté en tant que <strong>{{ authStore.user?.prenom }}</strong>
            </span>
            <Avatar :name="authStore.user?.prenom" size="sm" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Avatar from '../../components/ui/Avatar.vue'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Tag,
  Users,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()

// Mobile sidebar state
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const currentRoute = computed(() => route.name)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    AdminDashboard: 'Tableau de bord',
    AdminProducts: 'Gestion des produits',
    AdminCategories: 'Gestion des catégories',
    AdminOrders: 'Gestion des commandes',
    AdminCoupons: 'Gestion des coupons',
    AdminUsers: 'Gestion des utilisateurs',
  }
  return titles[route.name as string] || 'Administration'
})

onMounted(() => {
  // Vérifier que l'utilisateur est admin
  if (authStore.user?.role !== 'ADMIN') {
    // Rediriger vers la page d'accueil si pas admin
    // navigation vers /
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* Sidebar base styles */
.admin-sidebar {
  width: 260px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 50;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  text-decoration: none;
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-title {
  padding: 0 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid var(--border-light);
}

/* Main content */
.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.admin-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-content {
  flex: 1;
  padding: 2rem;
}

/* Mobile overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: block;
  }

  .admin-main {
    margin-left: 0;
  }

  .menu-toggle {
    display: block;
  }

  .hidden-mobile {
    display: none;
  }

  .admin-content {
    padding: 1rem;
  }

  .admin-header {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .admin-content {
    padding: 0.75rem;
  }

  .admin-header {
    padding: 0.75rem 1rem;
  }

  .page-title {
    font-size: 1.125rem;
  }
}
</style>
