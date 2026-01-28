<template>
  <div class="register-container">
    <div class="register-card">
      <h2>{{ t('auth.register.title') }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="prenom">{{ t('auth.register.firstName') }}</label>
            <input
              id="prenom"
              v-model="form.prenom"
              type="text"
              required
              :placeholder="t('auth.register.firstName')"
            />
          </div>

          <div class="form-group">
            <label for="nom">{{ t('auth.register.lastName') }}</label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              :placeholder="t('auth.register.lastName')"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">{{ t('auth.register.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :placeholder="t('auth.register.email')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('auth.register.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :placeholder="t('auth.register.password')"
            minlength="6"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ t('common.success') }} ! {{ t('auth.register.loginLink') }}...
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? t('common.loading') : t('auth.register.submit') }}
        </button>
      </form>

      <p class="login-link">
        {{ t('auth.register.hasAccount') }}
        <router-link to="/login">{{ t('auth.register.loginLink') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = false

  try {
    await authStore.register(form)
    success.value = true
    
    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../styles/design-system.css';

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-4);
}

.register-card {
  background: var(--color-bg-primary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  border: var(--border-width) solid var(--color-border-light);
}

.register-card h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
  }
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

.success-message {
  background-color: var(--color-success-light);
  color: var(--color-success);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
  font-size: var(--font-size-sm);
  border: var(--border-width) solid var(--color-success-light);
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

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.login-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.login-link a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Dark theme support */
:global(.dark) .register-card {
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