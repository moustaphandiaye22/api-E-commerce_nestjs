<template>
  <div class="admin-products">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des produits</h1>
        <p class="text-[var(--text-muted)]">Gérez votre catalogue de produits</p>
      </div>
      <router-link to="/admin/products/new" class="btn btn-primary">
        <Plus class="w-5 h-5" />
        Ajouter un produit
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <Search class="w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un produit..."
          @input="debouncedSearch"
        />
      </div>
      <select v-model="selectedCategory" class="filter-select" @change="loadProducts">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.nom }}
        </option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>SKU</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="loading-cell">
              <div class="animate-pulse flex items-center justify-center py-8">
                <div class="text-[var(--text-muted)]">Chargement...</div>
              </div>
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="7" class="empty-cell">
              <div class="flex flex-col items-center justify-center py-12">
                <Package class="w-12 h-12 text-[var(--text-muted)] mb-4" />
                <p class="text-[var(--text-secondary)]">Aucun produit trouvé</p>
                <router-link to="/admin/products/new" class="btn btn-primary mt-4">
                  Ajouter votre premier produit
                </router-link>
              </div>
            </td>
          </tr>
          <tr v-for="product in products" :key="product.id">
            <td>
              <div class="product-image">
                <!-- Support both 'images' (transformed) and 'images_produits' (raw) -->
                <img
                  v-if="(product.images?.[0]?.url_image || product.images_produits?.[0]?.url_image)"
                  :src="product.images?.[0]?.url_image || product.images_produits?.[0]?.url_image"
                  :alt="product.nom"
                />
                <div v-else class="image-placeholder">
                  <Image class="w-5 h-5" />
                </div>
              </div>
            </td>
            <td>
              <div class="product-info">
                <p class="product-name">{{ product.nom }}</p>
                <p class="product-desc">{{ product.description_courte || product.description?.substring(0, 50) }}...</p>
              </div>
            </td>
            <td class="sku">{{ product.sku }}</td>
            <td>
              <Badge variant="secondary" size="sm">
                {{ product.categorie?.nom || '-' }}
              </Badge>
            </td>
            <td class="price">{{ formatPrice(product.prix) }}</td>
            <td>
              <span
                class="stock-badge"
                :class="{
                  'in-stock': (product.quantite_stock ?? 0) > 10,
                  'low-stock': (product.quantite_stock ?? 0) <= 10 && (product.quantite_stock ?? 0) > 0,
                  'out-of-stock': (product.quantite_stock ?? 0) === 0,
                }"
              >
                {{ product.quantite_stock ?? 0 }}
              </span>
            </td>
            <td>
              <div class="actions">
                <router-link :to="`/admin/products/${product.id}`" class="action-btn" title="Modifier">
                  <Edit class="w-4 h-4" />
                </router-link>
                <button @click="confirmDelete(product)" class="action-btn delete" title="Supprimer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="pagination">
      <button
        :disabled="pagination.currentPage === 1"
        @click="goToPage(pagination.currentPage - 1)"
        class="pagination-btn"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <span class="pagination-info">
        Page {{ pagination.currentPage }} sur {{ pagination.totalPages }}
      </span>
      <button
        :disabled="pagination.currentPage === pagination.totalPages"
        @click="goToPage(pagination.currentPage + 1)"
        class="pagination-btn"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal :model-value="showDeleteModal" @update:model-value="showDeleteModal = $event">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer <strong>{{ productToDelete?.nom }}</strong> ?</p>
        <p class="warning-text">Cette action est irréversible.</p>
        <div class="modal-actions">
          <Button variant="secondary" @click="showDeleteModal = false">Annuler</Button>
          <Button variant="danger" :loading="deleting" @click="deleteProduct">
            Supprimer
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productsAPI } from '../../api/products'
import { categoriesAPI } from '../../api/categories'
import type { Product, Category } from '../../types/api'
import { useI18n } from '../../composables/useI18n'
import { formatPrice } from '../../utils/formatters'
import Button from '../../components/ui/Button.vue'
import Badge from '../../components/ui/Badge.vue'
import Modal from '../../components/ui/Modal.vue'
import {
  Plus,
  Search,
  Package,
  Image,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()
const { t } = useI18n()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const deleting = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0,
})

let searchTimeout: ReturnType<typeof setTimeout>

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 300)
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: pagination.value.currentPage,
      limit: 10,
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedCategory.value) params.category = selectedCategory.value

    const response = await productsAPI.getAll(params)
    
    // Handle the response format: { data: [...], total, page, limit }
    if (Array.isArray(response.data)) {
      products.value = response.data
    } else if (response.data?.data) {
      products.value = response.data.data
      if (response.data.total) pagination.value.total = response.data.total
      if (response.data.page) pagination.value.currentPage = response.data.page
      if (response.data.limit) pagination.value.limit = response.data.limit
    } else {
      products.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await categoriesAPI.getAll()
    categories.value = response.data || []
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const goToPage = (page: number) => {
  pagination.value.currentPage = page
  loadProducts()
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  deleting.value = true
  try {
    await productsAPI.delete(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    loadProducts()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.admin-products {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-700);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-box .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-width: 200px;
}

.table-container {
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
  letter-spacing: 0.05em;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--bg-secondary);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.product-info .product-name {
  font-weight: 500;
  color: var(--text-primary);
}

.product-info .product-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.sku {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.price {
  font-weight: 600;
  color: var(--color-primary);
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.stock-badge.in-stock {
  background: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}

.stock-badge.low-stock {
  background: rgba(245, 158, 11, 0.1);
  color: rgb(245, 158, 11);
}

.stock-badge.out-of-stock {
  background: rgba(220, 38, 38, 0.1);
  color: rgb(220, 38, 38);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.action-btn.delete:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background: var(--bg-hover);
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.modal-content {
  padding: 1.5rem;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.modal-content p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.warning-text {
  color: #dc2626 !important;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .filters-bar {
    flex-direction: column;
  }

  .search-box {
    max-width: 100%;
  }

  .filter-select {
    width: 100%;
    min-width: auto;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 800px;
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.125rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .admin-products {
    max-width: 100%;
  }
}
</style>

