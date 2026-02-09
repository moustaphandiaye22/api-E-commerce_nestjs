<template>
  <div class="max-w-7xl">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <!-- Products Stat -->
      <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-smooth">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <Package class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm text-[var(--text-muted)] mb-1">Produits</p>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] truncate">{{ stats.products }}</p>
        </div>
      </div>

      <!-- Categories Stat -->
      <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-smooth">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <FolderTree class="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm text-[var(--text-muted)] mb-1">Catégories</p>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] truncate">{{ stats.categories }}</p>
        </div>
      </div>

      <!-- Orders Stat -->
      <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-smooth">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
          <ShoppingBag class="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm text-[var(--text-muted)] mb-1">Commandes</p>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] truncate">{{ stats.orders }}</p>
        </div>
      </div>

      <!-- Users Stat -->
      <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-smooth">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <Users class="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm text-[var(--text-muted)] mb-1">Utilisateurs</p>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] truncate">{{ stats.users }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4 sm:mb-6">
        Actions rapides
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- Add Product -->
        <router-link
          to="/admin/products/new"
          class="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-(--bg-secondary) border border-(--border-light) rounded-xl hover:border-(--color-primary) hover:bg-(--color-primary-50) transition-smooth group"
        >
          <PlusCircle class="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span class="text-xs sm:text-sm font-medium text-[var(--text-primary)] text-center">Ajouter un produit</span>
        </router-link>

        <!-- Create Category -->
        <router-link
          to="/admin/categories"
          class="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-(--bg-secondary) border border-(--border-light) rounded-xl hover:border-(--color-primary) hover:bg-(--color-primary-50) transition-smooth group"
        >
          <FolderPlus class="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span class="text-xs sm:text-sm font-medium text-[var(--text-primary)] text-center">Créer une catégorie</span>
        </router-link>

        <!-- Create Coupon -->
        <router-link
          to="/admin/coupons/new"
          class="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-(--bg-secondary) border border-(--border-light) rounded-xl hover:border-(--color-primary) hover:bg-(--color-primary-50) transition-smooth group"
        >
          <Tag class="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span class="text-xs sm:text-sm font-medium text-[var(--text-primary)] text-center">Créer un coupon</span>
        </router-link>

        <!-- View Orders -->
        <router-link
          to="/admin/orders"
          class="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-(--bg-secondary) border border-(--border-light) rounded-xl hover:border-(--color-primary) hover:bg-(--color-primary-50) transition-smooth group"
        >
          <FileText class="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span class="text-xs sm:text-sm font-medium text-[var(--text-primary)] text-center">Voir les commandes</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-6">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4 sm:mb-6">
        Activité récente
      </h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="animate-pulse flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-(--bg-tertiary) rounded-full flex-shrink-0"></div>
          <div class="flex-1 min-w-0">
            <div class="h-3 sm:h-4 bg-(--bg-tertiary) rounded w-1/3 mb-2"></div>
            <div class="h-2 sm:h-3 bg-(--bg-tertiary) rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12 sm:py-16">
        <Activity class="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-muted)] mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-[var(--text-secondary)]">Aucune activité récente</p>
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
