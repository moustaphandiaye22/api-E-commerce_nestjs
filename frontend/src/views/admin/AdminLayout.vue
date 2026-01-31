<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/admin" class="admin-logo">
          <img src="/images/logos.png" alt="Baobab Market" class="h-8 w-8" />
          <span class="font-bold text-lg">Baobab Admin</span>
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <p class="nav-section-title">Principal</p>
          <router-link
            to="/admin"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminDashboard' }"
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
          >
            <Package class="w-5 h-5" />
            <span>Produits</span>
          </router-link>
          <router-link
            to="/admin/categories"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminCategories' }"
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
          >
            <ShoppingBag class="w-5 h-5" />
            <span>Commandes</span>
          </router-link>
          <router-link
            to="/admin/coupons"
            class="nav-item"
            :class="{ active: currentRoute === 'AdminCoupons' }"
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
          >
            <Users class="w-5 h-5" />
            <span>Utilisateurs</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" class="nav-item">
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
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="flex items-center gap-4">
            <span class="text-sm text-[var(--text-muted)]">
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
import { computed, onMounted } from 'vue'
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
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()

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

.admin-sidebar {
  width: 260px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 50;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  text-decoration: none;
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

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
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

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-content {
  flex: 1;
  padding: 2rem;
}
</style>

