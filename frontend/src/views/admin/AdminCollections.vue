<template>
  <div class="admin-collections">
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des collections</h1>
        <p class="text-[var(--text-muted)]">Créez et gérez vos collections de produits</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <Plus class="w-5 h-5" />
        Nouvelle collection
      </button>
    </div>

    <div class="collections-grid">
      <div v-if="loading" class="loading-state">
        <div v-for="n in 4" :key="n" class="collection-card-skeleton"></div>
      </div>

      <div v-else-if="collections.length === 0" class="empty-state">
        <FolderTree class="w-16 h-16 text-[var(--text-muted)] mb-4" />
        <p>Auc ne collection</p>
        <button @click="openModal()" class="btn btn-primary mt-4">
          Créer votre première collection
        </button>
      </div>

      <div v-for="collection in collections" :key="collection.id" class="collection-card">
        <div class="collection-image" v-if="collection.url_image">
          <img :src="collection.url_image" :alt="collection.nom" />
        </div>
        <div class="collection-image placeholder" v-else>
          <Image class="w-8 h-8" />
        </div>
        <div class="collection-info">
          <h3>{{ collection.nom }}</h3>
          <p>{{ collection.produits?.length || 0 }} produits</p>
          <span class="status-badge" :class="{ active: collection.est_actif }">
            {{ collection.est_actif ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <div class="collection-actions">
          <button @click="openModal(collection)" class="action-btn" title="Modifier">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(collection)" class="action-btn delete" title="Supprimer">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Collection Modal -->
    <Modal :model-value="showModal" @update:model-value="showModal = $event">
      <div class="modal-content">
        <h3>{{ editingCollection ? 'Modifier la collection' : 'Nouvelle collection' }}</h3>
        <form @submit.prevent="saveCollection">
          <div class="form-group">
            <label for="nom">Nom *</label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              placeholder="Nom de la collection"
            />
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              placeholder="slug-de-la-collection"
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Description de la collection"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="url_image">Image URL</label>
            <input
              id="url_image"
              v-model="form.url_image"
              type="text"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="form-group">
            <label for="ordre_tri">Ordre d'affichage</label>
            <input
              id="ordre_tri"
              v-model.number="form.ordre_tri"
              type="number"
              min="0"
            />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.est_actif" />
              Collection active
            </label>
          </div>
          <div class="modal-actions">
            <Button type="button" variant="secondary" @click="closeModal">Annuler</Button>
            <Button type="submit" variant="primary" :loading="saving">
              {{ editingCollection ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal :model-value="showDeleteModal" @update:model-value="showDeleteModal = $event">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer <strong>{{ collectionToDelete?.nom }}</strong> ?</p>
        <p class="warning-text">Cette action est irréversible.</p>
        <div class="modal-actions">
          <Button variant="secondary" @click="showDeleteModal = false">Annuler</Button>
          <Button variant="danger" :loading="deleting" @click="deleteCollection">
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

<style scoped>
.admin-collections {
  max-width: 1200px;
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

.btn-primary:hover {
  background: var(--color-primary-700);
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.collection-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.collection-image {
  height: 160px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-image.placeholder {
  color: var(--text-muted);
}

.collection-info {
  padding: 1rem;
  flex: 1;
}

.collection-info h3 {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.collection-info p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: rgba(107, 114, 128, 0.1);
  color: rgb(107, 114, 128);
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}

.collection-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--border-light);
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
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

.modal-content {
  padding: 1.5rem;
  min-width: 450px;
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

.form-group.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-group.checkbox-group input {
  width: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.warning-text {
  color: #dc2626 !important;
  font-size: 0.875rem;
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

.collection-card-skeleton {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  height: 250px;
}
</style>
