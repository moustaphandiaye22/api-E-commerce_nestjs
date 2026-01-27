<template>
  <div class="profile-page">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div class="container mx-auto px-4 py-16 md:py-24 relative">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-primary-100) text-(--color-primary-800) text-sm font-medium mb-4">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Mon espace personnel</span>
          </div>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-(--text-primary) leading-tight">
            Bienvenue,
            <span class="gradient-text">{{ authStore.user?.prenom || 'Utilisateur' }}</span>
          </h1>

          <p class="text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto">
            Gérez vos informations personnelles, vos adresses et consultez votre historique de commandes.
          </p>
        </div>
      </div>
    </section>

    <!-- Profile Content -->
    <section class="py-16 md:py-24 bg-(--bg-primary)">
      <div class="container mx-auto px-4">
        <div v-if="authStore.loading" class="flex justify-center items-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
        </div>

        <div v-else-if="authStore.user" class="max-w-4xl mx-auto space-y-8">
          <!-- Edit Profile Form -->
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) shadow-sm overflow-hidden">
            <div class="p-6 border-b border-(--border-light)">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-(--color-primary-100) flex items-center justify-center">
                    <svg class="w-5 h-5 text-(--color-primary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-semibold text-(--text-primary)">Informations personnelles</h2>
                </div>
                <Button v-if="!isEditing" @click="startEditing" variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            </div>

            <form v-if="isEditing" @submit.prevent="saveProfile" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="prenom" class="block text-sm font-medium text-(--text-primary)">Prénom *</label>
                  <input
                    id="prenom"
                    v-model="editForm.prenom"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
                  />
                </div>
                <div class="space-y-2">
                  <label for="nom" class="block text-sm font-medium text-(--text-primary)">Nom *</label>
                  <input
                    id="nom"
                    v-model="editForm.nom"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-(--text-primary)">Email *</label>
                <input
                  id="email"
                  v-model="editForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
                />
              </div>
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" :disabled="saving" variant="primary" class="flex-1">
                  {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </Button>
                <Button type="button" @click="cancelEditing" variant="outline" class="flex-1">
                  Annuler
                </Button>
              </div>
            </form>

            <div v-else class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex justify-between items-center py-3 border-b border-(--border-light)">
                  <span class="text-sm font-medium text-(--text-secondary)">Prénom:</span>
                  <span class="text-(--text-primary)">{{ authStore.user.prenom }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-(--border-light)">
                  <span class="text-sm font-medium text-(--text-secondary)">Nom:</span>
                  <span class="text-(--text-primary)">{{ authStore.user.nom }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-(--border-light)">
                  <span class="text-sm font-medium text-(--text-secondary)">Email:</span>
                  <span class="text-(--text-primary)">{{ authStore.user.email }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-(--border-light)">
                  <span class="text-sm font-medium text-(--text-secondary)">Rôle:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="authStore.user.role === 'ADMIN' ? 'bg-(--color-primary-100) text-(--color-primary-800)' : 'bg-(--color-gray-100) text-(--color-gray-800)'">
                    {{ authStore.user.role }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses Section -->
          <div class="bg-(--bg-primary) rounded-xl border border-(--border-light) shadow-sm overflow-hidden">
            <div class="p-6 border-b border-(--border-light)">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-(--color-primary-100) flex items-center justify-center">
                    <svg class="w-5 h-5 text-(--color-primary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-semibold text-(--text-primary)">Mes adresses</h2>
                </div>
                <Button @click="showAddAddress = true" variant="primary" size="sm">
                  Ajouter une adresse
                </Button>
              </div>
            </div>

            <div class="p-6">
              <div v-if="authStore.user.adresses && authStore.user.adresses.length > 0" class="space-y-4">
                <div v-for="address in authStore.user.adresses" :key="address.id"
                     class="p-4 border border-(--border-light) rounded-lg hover:border-(--color-primary) transition-colors">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <h3 class="font-medium text-(--text-primary)">{{ getAddressTypeText(address.type_adresse) }}</h3>
                      <span v-if="address.est_par_defaut"
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-(--color-success) text-white">
                        Par défaut
                      </span>
                    </div>
                  </div>
                  <div class="space-y-1 text-sm text-(--text-secondary)">
                    <p>{{ address.rue }}</p>
                    <p>{{ address.code_postal }} {{ address.ville }}</p>
                    <p>{{ address.pays }}</p>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <Button @click="editAddress(address)" variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button v-if="!address.est_par_defaut" @click="setAsDefault(address.id)" variant="ghost" size="sm">
                      Définir par défaut
                    </Button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-(--text-muted) mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-(--text-secondary)">Vous n'avez pas encore d'adresse enregistrée.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

    <!-- Add/Edit Address Modal -->
    <div v-if="showAddAddress || editingAddress"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         @click="closeAddressModal">
      <div class="bg-(--bg-primary) rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="p-6 border-b border-(--border-light)">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-(--text-primary)">
              {{ editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}
            </h2>
            <button @click="closeAddressModal"
                    class="p-2 rounded-lg hover:bg-(--bg-hover) transition-colors">
              <svg class="w-5 h-5 text-(--text-secondary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveAddress" class="p-6 space-y-4">
          <div class="space-y-2">
            <label for="address-type" class="block text-sm font-medium text-(--text-primary)">Type d'adresse *</label>
            <select id="address-type" v-model="addressForm.type_adresse" required
                    class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors">
              <option value="LIVRAISON">Adresse de livraison</option>
              <option value="FACTURATION">Adresse de facturation</option>
            </select>
          </div>
          <div class="space-y-2">
            <label for="address-street" class="block text-sm font-medium text-(--text-primary)">Rue *</label>
            <input
              id="address-street"
              v-model="addressForm.rue"
              type="text"
              required
              class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="address-postal" class="block text-sm font-medium text-(--text-primary)">Code postal *</label>
              <input
                id="address-postal"
                v-model="addressForm.code_postal"
                type="text"
                required
                class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
              />
            </div>
            <div class="space-y-2">
              <label for="address-city" class="block text-sm font-medium text-(--text-primary)">Ville *</label>
              <input
                id="address-city"
                v-model="addressForm.ville"
                type="text"
                required
                class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="address-country" class="block text-sm font-medium text-(--text-primary)">Pays *</label>
            <select id="address-country" v-model="addressForm.pays" required
                    class="w-full px-3 py-2 border border-(--border-medium) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-colors">
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <input
              id="address-default"
              v-model="addressForm.est_par_defaut"
              type="checkbox"
              class="rounded border-(--border-medium) text-(--color-primary) focus:ring-(--color-primary)"
            />
            <label for="address-default" class="text-sm text-(--text-secondary)">Définir comme adresse par défaut</label>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" :disabled="savingAddress" variant="primary" class="flex-1">
              {{ savingAddress ? 'Enregistrement...' : 'Enregistrer' }}
            </Button>
            <Button type="button" @click="closeAddressModal" variant="outline" class="flex-1">
              Annuler
            </Button>
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
import Button from '../components/ui/Button.vue'
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
@import '../styles/design-system.css';

.bg-grid-pattern {
  background-image:
    linear-gradient(to right, var(--border-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-light) 1px, transparent 1px);
  background-size: 40px 40px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>