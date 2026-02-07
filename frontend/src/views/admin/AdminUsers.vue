<template>
  <div class="admin-users">
    <div class="page-header">
      <div class="header-content">
        <h1>Gestion des utilisateurs</h1>
        <p class="text-[var(--text-muted)]">Gérez les comptes utilisateurs</p>
      </div>
    </div>

    <div class="users-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Inscrit le</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="loading-cell">Chargement...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="empty-cell">
              <Users class="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p>Aucun utilisateur</p>
            </td>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-info">
                <Avatar :name="user.prenom" size="sm" />
                <span>{{ user.prenom }} {{ user.nom }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <select
                :value="user.role"
                @change="updateRole(user, $event)"
                class="role-select"
              >
                <option value="USER">Utilisateur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </td>
<td>{{ formatDate(user.cree_le) }}</td>
            <td>
              <Badge :variant="user.est_actif ? 'success' : 'error'" size="sm">
                {{ user.est_actif ? 'Actif' : 'Inactif' }}
              </Badge>
            </td>
<td>
              <div class="actions">
                <button
                  v-if="!user.est_actif"
                  @click="toggleStatus(user)"
                  class="action-btn"
                  title="Activer"
                >
                  <Check class="w-4 h-4" />
                </button>
                <button
                  v-else
                  @click="toggleStatus(user)"
                  class="action-btn"
                  title="Désactiver"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usersAPI } from '../../api/users'
import type { User } from '../../types/api'
import Avatar from '../../components/ui/Avatar.vue'
import Badge from '../../components/ui/Badge.vue'
import { Users, Check, X } from 'lucide-vue-next'

const users = ref<User[]>([])
const loading = ref(true)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await usersAPI.getAll()
    users.value = response.data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const updateRole = async (user: User, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newRole = target.value
  
  try {
    await usersAPI.update(user.id, { role: newRole as 'USER' | 'ADMIN' })
    user.role = newRole as 'USER' | 'ADMIN'
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const toggleStatus = async (user: User) => {
  try {
    await usersAPI.update(user.id, { est_actif: !user.est_actif })
    user.est_actif = !user.est_actif
  } catch (error) {
    console.error('Erreur:', error)
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.admin-users {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.users-table-container {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.role-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.375rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
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

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem !important;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .users-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 700px;
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.125rem;
  }

  .admin-users {
    max-width: 100%;
  }

  .user-info span {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

