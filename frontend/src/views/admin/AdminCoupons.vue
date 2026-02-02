<template>
  <div class="admin-coupons">
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des coupons</h1>
        <p class="text-[var(--text-muted)]">Créez et gérez vos codes promo</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <Plus class="w-5 h-5" />
        Créer un coupon
      </button>
    </div>

    <div class="coupons-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Valeur</th>
            <th>Utilisations</th>
            <th>Expiry</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="loading-cell">Chargement...</td>
          </tr>
          <tr v-else-if="coupons.length === 0">
            <td colspan="7" class="empty-cell">
              <Tag class="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p>Aucun coupon</p>
            </td>
          </tr>
          <tr v-for="coupon in coupons" :key="coupon.id">
            <td class="code">{{ coupon.code }}</td>
            <td>
              <Badge :variant="coupon.type_reduction === 'POURCENTAGE' ? 'primary' : 'secondary'" size="sm">
                {{ coupon.type_reduction === 'POURCENTAGE' ? 'Pourcentage' : 'Montant fixe' }}
              </Badge>
            </td>
            <td class="value">
              {{ coupon.type_reduction === 'POURCENTAGE' ? `${coupon.valeur_reduction}%` : `${coupon.valeur_reduction} €` }}
            </td>
            <td>
              {{ coupon.nombre_utilisations }} / {{ coupon.limite_utilisation || '∞' }}
            </td>
            <td>{{ formatDate(coupon.date_fin) }}</td>
            <td>
              <Badge :variant="coupon.est_actif ? 'success' : 'error'" size="sm">
                {{ coupon.est_actif ? 'Actif' : 'Inactif' }}
              </Badge>
            </td>
            <td>
              <div class="actions">
                <button @click="openModal(coupon)" class="action-btn">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="confirmDelete(coupon)" class="action-btn delete">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Coupon Modal -->
    <Modal :model-value="showModal" @update:model-value="showModal = $event">
      <div class="modal-content">
        <h3>{{ editingCoupon ? 'Modifier le coupon' : 'Nouveau coupon' }}</h3>
        <form @submit.prevent="saveCoupon">
          <div class="form-group">
            <label for="code">Code *</label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              required
              placeholder="PROMO2024"
              @input="form.code = form.code.toUpperCase()"
            />
          </div>
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="2"
              required
              placeholder="Description du coupon"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="type">Type *</label>
              <select id="type" v-model="form.type_reduction" required>
                <option value="POURCENTAGE">Pourcentage</option>
                <option value="MONTANT_FIXE">Montant fixe</option>
              </select>
            </div>
            <div class="form-group">
              <label for="valeur">Valeur *</label>
              <input
                id="valeur"
                v-model.number="form.valeur_reduction"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="date_debut">Date de début *</label>
              <input
                id="date_debut"
                v-model="form.date_debut"
                type="date"
                required
              />
            </div>
            <div class="form-group">
              <label for="date_fin">Date d'expiration *</label>
              <input
                id="date_fin"
                v-model="form.date_fin"
                type="date"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="utilisations_max">Utilisations max</label>
              <input
                id="utilisations_max"
                v-model.number="form.limite_utilisation"
                type="number"
                min="0"
                placeholder="Illimité"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.est_actif" />
              Coupon actif
            </label>
          </div>
          <div class="modal-actions">
            <Button type="button" variant="secondary" @click="closeModal">Annuler</Button>
            <Button type="submit" variant="primary" :loading="saving">
              {{ editingCoupon ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { couponsAPI } from '../../api/coupons'
import type { Coupon } from '../../types/api'
import Button from '../../components/ui/Button.vue'
import Badge from '../../components/ui/Badge.vue'
import Modal from '../../components/ui/Modal.vue'
import { Plus, Tag, Edit, Trash2 } from 'lucide-vue-next'

const coupons = ref<Coupon[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingCoupon = ref<Coupon | null>(null)

const form = reactive({
  code: '',
  description: '',
  type_reduction: 'POURCENTAGE' as 'POURCENTAGE' | 'MONTANT_FIXE',
  valeur_reduction: 10,
  limite_utilisation: null as number | null,
  date_debut: '',
  date_fin: '',
  est_actif: true,
})

const formatDate = (date?: string) => {
  if (!date) return 'Jamais'
  return new Date(date).toLocaleDateString('fr-FR')
}

const loadCoupons = async () => {
  loading.value = true
  try {
    const response = await couponsAPI.getAll()
    coupons.value = response.data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (coupon?: Coupon) => {
  if (coupon) {
    editingCoupon.value = coupon
    Object.assign(form, {
      code: coupon.code,
      description: coupon.description || '',
      type_reduction: coupon.type_reduction,
      valeur_reduction: parseFloat(coupon.valeur_reduction) || 10,
      limite_utilisation: coupon.limite_utilisation,
      date_debut: coupon.date_debut?.split('T')[0] || '',
      date_fin: coupon.date_fin?.split('T')[0] || '',
      est_actif: coupon.est_actif,
    })
  } else {
    editingCoupon.value = null
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    Object.assign(form, { 
      code: '', 
      description: '',
      type_reduction: 'POURCENTAGE', 
      valeur_reduction: 10, 
      limite_utilisation: null, 
      date_debut: today,
      date_fin: nextMonth, 
      est_actif: true 
    })
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCoupon.value = null
}

const saveCoupon = async () => {
  saving.value = true
  try {
    // Convertir les dates au format ISO datetime
    const formatDateToISO = (dateStr: string) => {
      if (!dateStr) return new Date().toISOString()
      return new Date(dateStr).toISOString()
    }
    
    const data: Record<string, any> = {
      code: form.code,
      description: form.description,
      type_reduction: form.type_reduction,
      valeur_reduction: Number(form.valeur_reduction),
      est_actif: form.est_actif,
      date_debut: formatDateToISO(form.date_debut),
      date_fin: formatDateToISO(form.date_fin),
    }
    
    if (form.limite_utilisation) {
      data.limite_utilisation = form.limite_utilisation
    }
    
    if (editingCoupon.value) {
      await couponsAPI.updateCoupon(editingCoupon.value.id, data)
    } else {
      await couponsAPI.create(data)
    }
    closeModal()
    loadCoupons()
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (coupon: Coupon) => {
  if (confirm(`Supprimer le coupon "${coupon.code}" ?`)) {
    try {
      await couponsAPI.delete(coupon.id)
      loadCoupons()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
}

onMounted(loadCoupons)
</script>

<style scoped>
.admin-coupons {
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

.coupons-table-container {
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
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.code {
  font-family: monospace;
  font-weight: 600;
  color: var(--color-primary);
}

.value {
  font-weight: 600;
}

.actions {
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
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: auto !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem !important;
}
</style>
