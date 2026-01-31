<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon products">
          <Package class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Produits</p>
          <p class="stat-value">{{ stats.products }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon categories">
          <FolderTree class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Catégories</p>
          <p class="stat-value">{{ stats.categories }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">
          <ShoppingBag class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Commandes</p>
          <p class="stat-value">{{ stats.orders }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon users">
          <Users class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Utilisateurs</p>
          <p class="stat-value">{{ stats.users }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">Actions rapides</h2>
      <div class="quick-actions">
        <router-link to="/admin/products/new" class="action-card">
          <PlusCircle class="w-8 h-8 text-[var(--color-primary)]" />
          <span>Ajouter un produit</span>
        </router-link>
        <router-link to="/admin/categories" class="action-card">
          <FolderPlus class="w-8 h-8 text-[var(--color-primary)]" />
          <span>Créer une catégorie</span>
        </router-link>
        <router-link to="/admin/coupons/new" class="action-card">
          <Tag class="w-8 h-8 text-[var(--color-primary)]" />
          <span>Créer un coupon</span>
        </router-link>
        <router-link to="/admin/orders" class="action-card">
          <FileText class="w-8 h-8 text-[var(--color-primary)]" />
          <span>Voir les commandes</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="section">
      <h2 class="section-title">Activité récente</h2>
      <div class="activity-list">
        <div v-if="loading" class="loading-state">
          <div v-for="n in 3" :key="n" class="animate-pulse flex items-center gap-4 p-4">
            <div class="w-10 h-10 bg-(--bg-tertiary) rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-(--bg-tertiary) rounded w-1/3 mb-2"></div>
              <div class="h-3 bg-(--bg-tertiary) rounded w-1/4"></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <Activity class="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p class="text-[var(--text-secondary)]">Aucune activité récente</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsAPI } from '../../api/products'
import { categoriesAPI } from '../../api/categories'
import { ordersAPI } from '../../api/orders'
import { usersAPI } from '../../api/users'
import {
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  PlusCircle,
  FolderPlus,
  Tag,
  FileText,
  Activity,
} from 'lucide-vue-next'

const loading = ref(true)
const stats = ref({
  products: 0,
  categories: 0,
  orders: 0,
  users: 0,
})

onMounted(async () => {
  try {
    const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
      productsAPI.getAll({ limit: 1 }),
      categoriesAPI.getAll(),
      ordersAPI.getAll(),
      usersAPI.getAll(),
    ])
    
    stats.value = {
      products: productsRes.data?.length || 0,
      categories: categoriesRes.data?.length || 0,
      orders: ordersRes.data?.length || 0,
      users: usersRes.data?.length || 0,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.products {
  background: rgba(59, 130, 246, 0.1);
  color: rgb(59, 130, 246);
}

.stat-icon.categories {
  background: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}

.stat-icon.orders {
  background: rgba(245, 158, 11, 0.1);
  color: rgb(245, 158, 11);
}

.stat-icon.users {
  background: rgba(139, 92, 246, 0.1);
  color: rgb(139, 92, 246);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
}

.action-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
}

.action-card span {
  font-weight: 500;
  text-align: center;
}

.empty-state,
.loading-state {
  padding: 2rem;
  text-align: center;
}
</style>

