<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-(--bg-secondary) py-12 px-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-(--bg-primary) rounded-2xl shadow-xl border border-(--border-light) overflow-hidden">
        <!-- Header -->
        <div class="p-8 text-center border-b border-(--border-light) bg-(--bg-secondary)">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-bg flex items-center justify-center">
            <LogIn class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-(--text-primary) mb-2">
            {{ t('auth.login.title') }}
          </h2>
          <p class="text-sm text-(--text-secondary)">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Email -->
          <Input
            v-model="form.email"
            type="email"
            :label="t('auth.login.email')"
            :placeholder="'exemple@email.com'"
            required
            :error="errors.email"
            @blur="validateEmail"
          >
            <template #leading>
              <Mail class="w-5 h-5" />
            </template>
          </Input>

          <!-- Password -->
          <Input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :label="t('auth.login.password')"
            :placeholder="'••••••••'"
            required
            :error="errors.password"
            @blur="validatePassword"
          >
            <template #leading>
              <Lock class="w-5 h-5" />
            </template>
            <template #trailing>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-(--text-muted) hover:text-(--text-primary) transition-smooth"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </template>
          </Input>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-(--border-medium) text-(--color-primary) focus:ring-(--color-primary) focus:ring-2 focus:ring-offset-2"
              />
              <span class="text-sm text-(--text-secondary)">Se souvenir de moi</span>
            </label>
            <a href="#" class="text-sm text-(--color-primary) hover:text-(--color-primary-700) font-medium">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Error Message -->
          <Alert
            v-if="authStore.error"
            variant="error"
            closeable
            @close="authStore.error = null"
          >
            {{ authStore.error }}
          </Alert>

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="authStore.loading"
            :disabled="!isFormValid"
          >
            {{ authStore.loading ? t('common.loading') : t('auth.login.submit') }}
          </Button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-(--border-light)"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-(--bg-primary) text-(--text-muted)">
                Ou continuer avec
              </span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-(--border-medium) rounded-lg hover:bg-(--bg-hover) transition-smooth"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium text-(--text-primary)">Google</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-(--border-medium) rounded-lg hover:bg-(--bg-hover) transition-smooth"
            >
              <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-sm font-medium text-(--text-primary)">Facebook</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-8 py-6 bg-(--bg-secondary) border-t border-(--border-light) text-center">
          <p class="text-sm text-(--text-secondary)">
            {{ t('auth.login.noAccount') }}
            <router-link
              to="/register"
              class="text-(--color-primary) hover:text-(--color-primary-700) font-semibold"
            >
              {{ t('auth.login.registerLink') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Additional Links -->
      <div class="mt-8 text-center space-y-2">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--color-primary) transition-smooth"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import Alert from '../components/ui/Alert.vue'
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const rememberMe = ref(false)

const isFormValid = computed(() => {
  return form.email && form.password && !errors.email && !errors.password
})

const validateEmail = () => {
  if (!form.email) {
    errors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email invalide'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  } else {
    errors.password = ''
  }
}

const handleSubmit = async () => {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) return

  try {
    await authStore.login(form)
    
    // Redirect to intended page or home
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}
</script>
