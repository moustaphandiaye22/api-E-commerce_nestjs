<template>
  <div class="max-w-7xl">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Gestion des collections</h1>
        <p class="text-sm text-[var(--text-muted)] mt-1">Créez et gérez vos collections de produits</p>
      </div>
      <Button variant="primary" @click="openModal()" class="w-full sm:w-auto">
        <Plus class="w-5 h-5" />
        <span>Nouvelle collection</span>
      </Button>
    </div>

    <!-- Collections Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="n in 4" :key="n" class="animate-pulse">
          <div class="bg-(--bg-tertiary) h-40 rounded-t-xl"></div>
          <div class="bg-(--bg-primary) border border-(--border-light) rounded-b-xl p-4 space-y-3">
            <div class="h-4 bg-(--bg-tertiary) rounded w-3/4"></div>
            <div class="h-3 bg-(--bg-tertiary) rounded w-1/2"></div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else-if="collections.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 sm:py-20">
        <FolderTree class="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-muted)] mb-4" />
        <p class="text-[var(--text-secondary)] mb-4">Aucune collection</p>
        <Button variant="primary" @click="openModal()">
          Créer votre première collection
        </Button>
      </div>

      <!-- Collection Cards -->
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="bg-(--bg-primary) rounded-xl border border-(--border-light) overflow-hidden transition-smooth hover:shadow-lg hover:border-(--color-primary) group"
      >
        <!-- Image -->
        <div class="h-32 sm:h-40 bg-(--bg-secondary) flex items-center justify-center overflow-hidden">
          <img
            v-if="collection.url_image"
            :src="collection.url_image"
            :alt="collection.nom"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Image v-else class="w-8 h-8 sm:w-10 sm:h-10 text-[var(--text-muted)]" />
        </div>

        <!-- Content -->
        <div class="p-3 sm:p-4 space-y-2">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm sm:text-base truncate">
            {{ collection.nom }}
          </h3>
          <p class="text-xs sm:text-sm text-[var(--text-muted)]">
            {{ collection.produits?.length || 0 }} produit{{ (collection.produits?.length || 0) > 1 ? 's' : '' }}
          </p>
          <span
            :class="[
              'inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium',
              collection.est_actif
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ collection.est_actif ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 p-3 sm:p-4 pt-0 border-t border-(--border-light)">
          <button
            @click="openModal(collection)"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-lg bg-(--bg-secondary) hover:bg-(--bg-hover) text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-smooth text-sm"
            title="Modifier"
          >
            <Edit class="w-4 h-4" />
            <span class="hidden sm:inline">Modifier</span>
          </button>
          <button
            @click="confirmDelete(collection)"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-lg bg-(--bg-secondary) hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-600 transition-smooth text-sm"
            title="Supprimer"
          >
            <Trash2 class="w-4 h-4" />
            <span class="hidden sm:inline">Supprimer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Collection Modal -->
    <Modal :model-value="showModal" @update:model-value="showModal = $event">
      <div class="p-4 sm:p-6 w-full max-w-lg">
        <h3 class="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-4 sm:mb-6">
          {{ editingCollection ? 'Modifier la collection' : 'Nouvelle collection' }}
        </h3>
        
        <form @submit.prevent="saveCollection" class="space-y-4 sm:space-y-5">
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
              placeholder="Nom de la collection"
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
              placeholder="slug-de-la-collection"
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
              placeholder="Description de la collection"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth resize-none text-sm sm:text-base"
            ></textarea>
          </div>

          <!-- Image URL -->
          <div>
            <label for="url_image" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Image URL
            </label>
            <input
              id="url_image"
              v-model="form.url_image"
              type="text"
              placeholder="https://example.com/image.jpg"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm sm:text-base"
            />
          </div>

          <!-- Ordre -->
          <div>
            <label for="ordre_tri" class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Ordre d'affichage
            </label>
            <input
              id="ordre_tri"
              v-model.number="form.ordre_tri"
              type="number"
              min="0"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-(--border-light) bg-(--bg-secondary) text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm sm:text-base"
            />
          </div>

          <!-- Active Checkbox -->
          <div class="flex items-center gap-2">
            <input
              id="est_actif"
              type="checkbox"
              v-model="form.est_actif"
              class="w-4 h-4 rounded border-(--border-medium) text-[var(--color-primary)] focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 cursor-pointer"
            />
            <label for="est_actif" class="text-sm font-medium text-[var(--text-secondary)] cursor-pointer">
              Collection active
            </label>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-(--border-light)">
            <Button type="button" variant="secondary" @click="closeModal" class="w-full sm:w-auto">
              Annuler
            </Button>
            <Button type="submit" variant="primary" :loading="saving" class="w-full sm:w-auto">
              {{ editingCollection ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal :model-value="showDeleteModal" @update:model-value="showDeleteModal = $event">
      <div class="p-4 sm:p-6 w-full max-w-md">
        <h3 class="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Confirmer la suppression
        </h3>
        <p class="text-sm sm:text-base text-[var(--text-secondary)] mb-2">
          Êtes-vous sûr de vouloir supprimer <strong class="text-[var(--text-primary)]">{{ collectionToDelete?.nom }}</strong> ?
        </p>
        <p class="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-6">
          Cette action est irréversible.
        </p>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="secondary" @click="showDeleteModal = false" class="w-full sm:w-auto">
            Annuler
          </Button>
          <Button variant="danger" :loading="deleting" @click="deleteCollection" class="w-full sm:w-auto">
            Supprimer
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { collectionsAPI } from '../../api/collections'
import type { Collection } from '../../types/api'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import { Plus, FolderTree, Edit, Trash2, Image } from 'lucide-vue-next'

const collections = ref<Collection[]>([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCollection = ref<Collection | null>(null)
const collectionToDelete = ref<Collection | null>(null)

const form = reactive({
  nom: '',
  slug: '',
  description: '',
  url_image: '',
  ordre_tri: 0,
  est_actif: true,
})

const loadCollections = async () => {
  loading.value = true
  try {
    const response = await collectionsAPI.getAll()
    collections.value = response.data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (collection?: Collection) => {
  if (collection) {
    editingCollection.value = collection
    Object.assign(form, {
      nom: collection.nom,
      slug: collection.slug || '',
      description: collection.description || '',
      url_image: collection.url_image || '',
      ordre_tri: collection.ordre_tri || 0,
      est_actif: collection.est_actif,
    })
  } else {
    editingCollection.value = null
    Object.assign(form, { nom: '', slug: '', description: '', url_image: '', ordre_tri: 0, est_actif: true })
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCollection.value = null
}

const saveCollection = async () => {
  saving.value = true
  try {
    if (editingCollection.value) {
      await collectionsAPI.update(editingCollection.value.id, form)
    } else {
      await collectionsAPI.create(form)
    }
    closeModal()
    loadCollections()
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (collection: Collection) => {
  collectionToDelete.value = collection
  showDeleteModal.value = true
}

const deleteCollection = async () => {
  if (!collectionToDelete.value) return
  
  deleting.value = true
  try {
    await collectionsAPI.delete(collectionToDelete.value.id)
    showDeleteModal.value = false
    collectionToDelete.value = null
    loadCollections()
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(loadCollections)
</script>
