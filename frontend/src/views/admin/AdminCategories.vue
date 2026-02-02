<template>
  <div class="admin-categories">
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des catégories</h1>
        <p class="text-[var(--text-muted)]">Organisez vos produits par catégories</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <Plus class="w-5 h-5" />
        Ajouter une catégorie
      </button>
    </div>

    <div class="categories-grid">
      <div v-if="loading" class="loading-state">
        <div v-for="n in 6" :key="n" class="animate-pulse category-card-skeleton"></div>
      </div>
      
      <div v-else-if="categories.length === 0" class="empty-state">
        <FolderTree class="w-16 h-16 text-[var(--text-muted)] mb-4" />
        <p>Auc ne catégorie</p>
        <button @click="openModal()" class="btn btn-primary mt-4">
          Créer votre première catégorie
        </button>
      </div>

      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-icon" :style="{ background: category.couleur || '#3b82f6' }">
          <FolderTree class="w-6 h-6 text-white" />
        </div>
        <div class="category-info">
          <h3>{{ category.nom }}</h3>
          <p>{{ category.slug }}</p>
        </div>
        <div class="category-actions">
          <button @click="openModal(category)" class="action-btn">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(category)" class="action-btn delete">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <Modal :model-value="showModal" @update:model-value="showModal = $event">
      <div class="modal-content">
        <h3>{{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label for="nom">Nom *</label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              placeholder="Nom de la catégorie"
            />
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              placeholder="slug-de-la-categorie"
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Description de la catégorie"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="couleur">Couleur</label>
            <input
              id="couleur"
              v-model="form.couleur"
              type="color"
            />
          </div>
          <div class="modal-actions">
            <Button type="button" variant="secondary" @click="closeModal">Annuler</Button>
            <Button type="submit" variant="primary" :loading="saving">
              {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { categoriesAPI } from '../../api/categories'
import type { Category } from '../../types/api'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import { Plus, FolderTree, Edit, Trash2 } from 'lucide-vue-next'

const categories = ref<Category[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingCategory = ref<Category | null>(null)

const form = reactive({
  nom: '',
  slug: '',
  description: '',
  couleur: '#3b82f6',
})

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await categoriesAPI.getAll()
    categories.value = response.data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (category?: Category) => {
  if (category) {
    editingCategory.value = category
    Object.assign(form, {
      nom: category.nom,
      slug: category.slug,
      description: category.description || '',
      couleur: category.couleur || '#3b82f6',
    })
  } else {
    editingCategory.value = null
    Object.assign(form, { nom: '', slug: '', description: '', couleur: '#3b82f6' })
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
}

const saveCategory = async () => {
  saving.value = true
  try {
    if (editingCategory.value) {
      await categoriesAPI.update(editingCategory.value.id, form)
    } else {
      await categoriesAPI.create(form)
    }
    closeModal()
    loadCategories()
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (category: Category) => {
  if (confirm(`Supprimer "${category.nom}" ?`)) {
    try {
      await categoriesAPI.delete(category.id)
      loadCategories()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
}

onMounted(loadCategories)
</script>

<style scoped>
.admin-categories {
  max-width: 1000px;
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
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.category-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-info {
  flex: 1;
}

.category-info h3 {
  font-weight: 600;
  color: var(--text-primary);
}

.category-info p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--bg-hover);
}

.action-btn.delete:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.modal-content {
  padding: 1.5rem;
  min-width: 400px;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.form-group input[type="color"] {
  height: 42px;
  padding: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.empty-state,
.loading-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.category-card-skeleton {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  height: 80px;
}
</style>

