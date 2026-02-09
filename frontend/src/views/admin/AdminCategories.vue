<template>
  <div class="max-w-6xl">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Gestion des catégories</h1>
        <p class="text-sm text-[var(--text-muted)] mt-1">Organisez vos produits par catégories</p>
      </div>
      <Button variant="primary" @click="openModal()" class="w-full sm:w-auto">
        <Plus class="w-5 h-5" />
        <span>Ajouter une catégorie</span>
      </Button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 bg-(--bg-tertiary) rounded-xl flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-(--bg-tertiary) rounded w-3/4"></div>
              <div class="h-3 bg-(--bg-tertiary) rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 sm:py-20">
        <FolderTree class="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-muted)] mb-4" />
        <p class="text-[var(--text-secondary)] mb-4">Aucune catégorie</p>
        <Button variant="primary" @click="openModal()">
          Créer votre première catégorie
        </Button>
      </div>

      <!-- Category Cards -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-(--bg-primary) border border-(--border-light) rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-(--color-primary) transition-smooth group"
      >
        <div class="flex items-center gap-3 sm:gap-4 mb-3">
          <!-- Icon with custom color -->
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            :style="{ background: category.couleur || '#3b82f6' }"
          >
            <FolderTree class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm sm:text-base truncate mb-0.5">
              {{ category.nom }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--text-muted)] truncate">
              {{ category.slug }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-(--border-light)">
          <button
            @click="openModal(category)"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-(--bg-secondary) hover:bg-(--bg-hover) text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-smooth text-sm"
            title="Modifier"
          >
            <Edit class="w-4 h-4" />
            <span class="hidden sm:inline">Modifier</span>
          </button>
          <button
            @click="confirmDelete(category)"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-(--bg-secondary) hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-600 transition-smooth text-sm"
            title="Supprimer"
          >
            <Trash2 class="w-4 h-4" />
            <span class="hidden sm:inline">Supprimer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <Modal :model-value="showModal" @update:model-value="showModal = $event">
      <div class="p-4 sm:p-6 w-full max-w-lg">
        <h3 class="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-4 sm:mb-6">
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </h3>
        
        <form @submit.prevent="saveCategory" class="space-y-4 sm:space-y-5">
          <!-- Nom -->
          <div>
            <label for="nom" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              placeholder="Nom de la catégorie"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm sm:text-base"
            />
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Slug
            </label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              placeholder="slug-de-la-categorie"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm sm:text-base"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Description de la catégorie"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth resize-none text-sm sm:text-base"
            ></textarea>
          </div>

          <!-- Couleur -->
          <div>
            <label for="couleur" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Couleur
            </label>
            <input
              id="couleur"
              v-model="form.couleur"
              type="color"
              class="w-full h-10 sm:h-12 rounded-lg border border-(--border-light) cursor-pointer"
            />
          </div>

          <!-- Catégorie parente -->
          <div>
            <label for="categorie_parent_id" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Catégorie parente
            </label>
            <select
              id="categorie_parent_id"
              v-model="form.categorie_parent_id"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth appearance-none cursor-pointer text-sm sm:text-base"
            >
              <option value="">Aucune (catégorie principale)</option>
              <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                {{ cat.nom }}
              </option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-(--border-light)">
            <Button type="button" variant="secondary" @click="closeModal" class="w-full sm:w-auto">
              Annuler
            </Button>
            <Button type="submit" variant="primary" :loading="saving" class="w-full sm:w-auto">
              {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
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
  categorie_parent_id: '',
})

const parentCategories = computed(() => {
  return categories.value.filter(cat => cat.id !== editingCategory.value?.id)
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
      categorie_parent_id: (category as any).categorie_parent_id || '',
    })
  } else {
    editingCategory.value = null
    Object.assign(form, { nom: '', slug: '', description: '', couleur: '#3b82f6', categorie_parent_id: '' })
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
