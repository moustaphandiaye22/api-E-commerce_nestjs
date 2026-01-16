<template>
  <div class="profile-page">
    <h1>Mon Profil</h1>

    <div v-if="authStore.loading" class="loading">
      Chargement du profil...
    </div>

    <div v-else-if="authStore.user" class="profile-content">
      <div class="profile-card">
        <h2>Informations personnelles</h2>
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

      <div v-if="authStore.user.adresses && authStore.user.adresses.length > 0" class="addresses-card">
        <h2>Mes adresses</h2>
        <div v-for="address in authStore.user.adresses" :key="address.id" class="address-item">
          <h3>{{ address.type_adresse }}</h3>
          <p>{{ address.rue }}</p>
          <p>{{ address.code_postal }} {{ address.ville }}</p>
          <p>{{ address.pays }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchProfile()
  }
})
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
</style>