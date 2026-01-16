<template>
  <div class="home">
    <h1>Bienvenue sur l'application E-commerce</h1>
    <p v-if="authStore.isAuthenticated">
      Connecté en tant que: {{ authStore.user?.prenom }} {{ authStore.user?.nom }}
    </p>
    <div class="nav-links">
      <router-link to="/products" class="btn">Voir les produits</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn">Se connecter</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn">S'inscrire</router-link>
      <router-link v-if="authStore.isAuthenticated" to="/profile" class="btn">Mon profil</router-link>
      <button v-if="authStore.isAuthenticated" @click="handleLogout" class="btn btn-danger">
        Déconnexion
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@import '../styles/design-system.css';

.home {
  max-width: var(--max-width-lg);
  margin: 0 auto;
  padding: var(--spacing-8) var(--container-padding);
  text-align: center;
}

.home h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.home p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
}

.nav-links {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.btn:hover {
  background-color: var(--color-primary-dark);
}

.btn-danger {
  background-color: var(--color-error);
}

.btn-danger:hover {
  background-color: var(--color-error);
  opacity: 0.9;
}
</style>