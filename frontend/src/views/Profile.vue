<template>
  <div class="profile-page">
    <h1>Mon Profil</h1>

    <div v-if="authStore.loading" class="loading">
      Chargement du profil...
    </div>

    <div v-else-if="authStore.user" class="profile-content">
      <!-- Edit Profile Form -->
      <div class="profile-card">
        <div class="card-header">
          <h2>Informations personnelles</h2>
          <button v-if="!isEditing" @click="startEditing" class="btn-edit">
            Modifier
          </button>
        </div>

        <form v-if="isEditing" @submit.prevent="saveProfile" class="edit-form">
          <div class="form-group">
            <label for="prenom">Prénom *</label>
            <input
              id="prenom"
              v-model="editForm.prenom"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="nom">Nom *</label>
            <input
              id="nom"
              v-model="editForm.nom"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="editForm.email"
              type="email"
              required
            />
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-save">
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" @click="cancelEditing" class="btn-cancel">
              Annuler
            </button>
          </div>
        </form>

        <div v-else class="info-display">
          <div class="info-group">
            <label>Prénom:</label>
            <span>{{ authStore.user.prenom }}</span>
          </div>
          <div class="info-group">
            <label>Nom:</label>
            <span>{{ authStore.user.nom }}</span>
          </div>
          <div class="info-group">
            <label>Email:</label>
            <span>{{ authStore.user.email }}</span>
          </div>
          <div class="info-group">
            <label>Rôle:</label>
            <span class="role-badge" :class="authStore.user.role.toLowerCase()">
              {{ authStore.user.role }}
            </span>
          </div>
        </div>
      </div>

      <!-- Addresses Section -->
      <div class="addresses-card">
        <div class="card-header">
          <h2>Mes adresses</h2>
          <button @click="showAddAddress = true" class="btn-add">
            Ajouter une adresse
          </button>
        </div>

        <div v-if="authStore.user.adresses && authStore.user.adresses.length > 0" class="addresses-list">
          <div v-for="address in authStore.user.adresses" :key="address.id" class="address-item">
            <div class="address-header">
              <h3>{{ getAddressTypeText(address.type_adresse) }}</h3>
              <div v-if="address.est_par_defaut" class="default-badge">Par défaut</div>
            </div>
            <p>{{ address.rue }}</p>
            <p>{{ address.code_postal }} {{ address.ville }}</p>
            <p>{{ address.pays }}</p>
            <div class="address-actions">
              <button @click="editAddress(address)" class="btn-edit-small">
                Modifier
              </button>
              <button v-if="!address.est_par_defaut" @click="setAsDefault(address.id)" class="btn-default">
                Définir par défaut
              </button>
            </div>
          </div>
        </div>

        <div v-else class="no-addresses">
          <p>Vous n'avez pas encore d'adresse enregistrée.</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <div v-if="showAddAddress || editingAddress" class="modal-overlay" @click="closeAddressModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}</h2>
          <button @click="closeAddressModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="modal-body">
          <div class="form-group">
            <label for="address-type">Type d'adresse *</label>
            <select id="address-type" v-model="addressForm.type_adresse" required>
              <option value="LIVRAISON">Adresse de livraison</option>
              <option value="FACTURATION">Adresse de facturation</option>
            </select>
          </div>
          <div class="form-group">
            <label for="address-street">Rue *</label>
            <input
              id="address-street"
              v-model="addressForm.rue"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="address-postal">Code postal *</label>
            <input
              id="address-postal"
              v-model="addressForm.code_postal"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="address-city">Ville *</label>
            <input
              id="address-city"
              v-model="addressForm.ville"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="address-country">Pays *</label>
            <select id="address-country" v-model="addressForm.pays" required>
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
            </select>
          </div>
          <div class="form-group checkbox">
            <input
              id="address-default"
              v-model="addressForm.est_par_defaut"
              type="checkbox"
            />
            <label for="address-default">Définir comme adresse par défaut</label>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="savingAddress" class="btn-save">
              {{ savingAddress ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" @click="closeAddressModal" class="btn-cancel">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usersAPI } from '../api/users'
import type { Address } from '../types/api'

const authStore = useAuthStore()

// Profile editing
const isEditing = ref(false)
const saving = ref(false)
const editForm = ref({
  prenom: '',
  nom: '',
  email: ''
})

// Address management
const showAddAddress = ref(false)
const editingAddress = ref<Address | null>(null)
const savingAddress = ref(false)
const addressForm = ref({
  type_adresse: 'LIVRAISON' as 'LIVRAISON' | 'FACTURATION',
  rue: '',
  code_postal: '',
  ville: '',
  pays: 'France',
  est_par_defaut: false
})

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchProfile()
  }
})

// Profile methods
const startEditing = () => {
  if (authStore.user) {
    editForm.value = {
      prenom: authStore.user.prenom,
      nom: authStore.user.nom,
      email: authStore.user.email
    }
    isEditing.value = true
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = { prenom: '', nom: '', email: '' }
}

const saveProfile = async () => {
  if (!authStore.user) return

  saving.value = true
  try {
    await usersAPI.update(authStore.user.id, editForm.value)
    // Update local user data
    authStore.user.prenom = editForm.value.prenom
    authStore.user.nom = editForm.value.nom
    authStore.user.email = editForm.value.email
    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

// Address methods
const getAddressTypeText = (type: string) => {
  return type === 'LIVRAISON' ? 'Adresse de livraison' : 'Adresse de facturation'
}

const editAddress = (address: Address) => {
  editingAddress.value = address
  addressForm.value = {
    type_adresse: address.type_adresse,
    rue: address.rue,
    code_postal: address.code_postal,
    ville: address.ville,
    pays: address.pays,
    est_par_defaut: address.est_par_defaut
  }
}

const setAsDefault = async (addressId: string) => {
  // TODO: Implement set default address API call
  console.log('Setting address as default:', addressId)
}

const saveAddress = async () => {
  savingAddress.value = true
  try {
    if (editingAddress.value) {
      // Update existing address
      console.log('Updating address:', editingAddress.value.id, addressForm.value)
    } else {
      // Create new address
      console.log('Creating new address:', addressForm.value)
    }
    closeAddressModal()
  } catch (error) {
    console.error('Error saving address:', error)
  } finally {
    savingAddress.value = false
  }
}

const closeAddressModal = () => {
  showAddAddress.value = false
  editingAddress.value = null
  addressForm.value = {
    type_adresse: 'LIVRAISON',
    rue: '',
    code_postal: '',
    ville: '',
    pays: 'France',
    est_par_defaut: false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-page h1 {
  margin-bottom: 2rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card,
.addresses-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card h2,
.addresses-card h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 0.5rem;
}

.info-group {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.info-group:last-child {
  border-bottom: none;
}

.info-group label {
  font-weight: 500;
  color: #555;
}

.info-group span {
  color: #333;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.role-badge.admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.user {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.address-item {
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.address-item:last-child {
  margin-bottom: 0;
}

.address-item h3 {
  margin: 0 0 0.5rem 0;
  color: #4CAF50;
  font-size: 1rem;
}

.address-item p {
  margin: 0.25rem 0;
  color: #666;
}

/* === EDITING STYLES === */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-edit, .btn-add {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-edit:hover, .btn-add:hover {
  background-color: #45a049;
}

.edit-form {
  display: grid;
  gap: 1rem;
}

.edit-form .form-group {
  display: grid;
  gap: 0.5rem;
}

.edit-form label {
  font-weight: 500;
  color: #555;
}

.edit-form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.edit-form input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-save:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}

/* === ADDRESSES STYLES === */
.addresses-list {
  display: grid;
  gap: 1rem;
}

.address-item {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.address-header h3 {
  margin: 0;
  color: #4CAF50;
  font-size: 1rem;
}

.default-badge {
  background-color: #2196F3;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit-small, .btn-default {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-edit-small {
  background-color: #2196F3;
  color: white;
}

.btn-edit-small:hover {
  background-color: #1976D2;
}

.btn-default {
  background-color: #FF9800;
  color: white;
}

.btn-default:hover {
  background-color: #F57C00;
}

.no-addresses {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* === MODAL STYLES === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.modal-close:hover {
  background-color: #f5f5f5;
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body .form-group {
  margin-bottom: 1rem;
}

.modal-body .form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-body .form-group.checkbox input {
  width: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }

  .address-actions {
    flex-direction: column;
  }
}
</style>