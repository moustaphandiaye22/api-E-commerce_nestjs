<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ t('auth.login.title') }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">{{ t('auth.login.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :placeholder="t('auth.login.email')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('auth.login.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :placeholder="t('auth.login.password')"
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" class="btn-submit" :disabled="authStore.loading">
          {{ authStore.loading ? t('common.loading') : t('auth.login.submit') }}
        </button>
      </form>

      <p class="register-link">
        {{ t('auth.login.noAccount') }}
        <router-link to="/register">{{ t('auth.login.registerLink') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    await authStore.login(form)

    // Forcer un rechargement de la page pour synchroniser l'état du menu
    window.location.href = '/'
  } catch (error) {
    // L'erreur est déjà gérée par le store et affichée via authStore.error
    console.error('Erreur de connexion:', error)
  }
}
</script>

<style scoped>
@import '../styles/design-system.css';

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
}

.login-card {
  background: var(--color-bg-primary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
  border: var(--border-width) solid var(--color-border-light);
}

.login-card h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  box-sizing: border-box;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-lighter);
}

.error-message {
  background-color: var(--color-error-light);
  color: var(--color-error);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
  font-size: var(--font-size-sm);
  border: var(--border-width) solid var(--color-error-light);
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-submit:disabled {
  background-color: var(--color-text-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.register-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.register-link a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Dark theme support */
:global(.dark) .login-card {
  background: var(--color-bg-primary);
  border-color: var(--color-border-light);
}

:global(.dark) .form-group input {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border-medium);
  color: var(--color-text-primary);
}

:global(.dark) .form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(70, 130, 180, 0.1);
}
</style>