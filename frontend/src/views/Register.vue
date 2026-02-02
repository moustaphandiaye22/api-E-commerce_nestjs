<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-(--bg-secondary) py-12 px-4">
    <div class="w-full max-w-3xl">
      <!-- Card -->
      <div class="bg-(--bg-primary) rounded-2xl shadow-xl border border-(--border-light) overflow-hidden">
        <!-- Header -->
        <div class="p-8 text-center border-b border-(--border-light) bg-(--bg-secondary)">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-bg flex items-center justify-center">
            <UserPlus class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {{ t('auth.register.title') }}
          </h2>
          <p class="text-sm text-[var(--text-secondary)]">
            Créez votre compte pour commencer vos achats
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Name Row (2 columns) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <Input
              v-model="form.prenom"
              type="text"
              :label="t('auth.register.firstName')"
              placeholder="Jean"
              required
              :error="errors.prenom"
              @blur="validatePrenom"
            >
              <template #leading>
                <User class="w-5 h-5" />
              </template>
            </Input>

            <!-- Last Name -->
            <Input
              v-model="form.nom"
              type="text"
              :label="t('auth.register.lastName')"
              placeholder="Dupont"
              required
              :error="errors.nom"
              @blur="validateNom"
            >
              <template #leading>
                <User class="w-5 h-5" />
              </template>
            </Input>
          </div>

          <!-- Contact Row (2 columns) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email -->
            <Input
              v-model="form.email"
              type="email"
              :label="t('auth.register.email')"
              placeholder="exemple@email.com"
              required
              :error="errors.email"
              @blur="validateEmail"
            >
              <template #leading>
                <Mail class="w-5 h-5" />
              </template>
            </Input>

            <!-- Phone -->
            <Input
              v-model="form.telephone"
              type="tel"
              :label="t('Telephone')"
              placeholder="+33 6 12 34 56 78"
              :error="errors.telephone"
              autocomplete="tel"
            >
              <template #leading>
                <Phone class="w-5 h-5" />
              </template>
            </Input>
          </div>

          <!-- Password Row (2 columns) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password -->
            <Input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :label="t('auth.register.password')"
              placeholder="••••••••"
              required
              minlength="6"
              :error="errors.password"
              autocomplete="new-password"
              @blur="validatePassword"
            >
              <template #leading>
                <Lock class="w-5 h-5" />
              </template>
              <template #trailing>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-smooth"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </template>
            </Input>

            <!-- Confirm Password -->
            <Input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :label="t('auth.register.confirmPassword')"
              placeholder="••••••••"
              required
              minlength="6"
              :error="errors.confirmPassword"
              autocomplete="new-password"
              @blur="validateConfirmPassword"
            >
              <template #leading>
                <Lock class="w-5 h-5" />
              </template>
              <template #trailing>
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-smooth"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </template>
            </Input>
          </div>

          <!-- Password Requirements -->
          <div class="bg-(--bg-secondary) rounded-lg p-4 border border-(--border-light)">
            <p class="text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
              <Info class="w-4 h-4" />
              Le mot de passe doit contenir:
            </p>
            <ul class="space-y-1 text-xs text-[var(--text-muted)]">
              <li class="flex items-center gap-2">
                <Check :class="form.password.length >= 6 ? 'text-[var(--color-success)]' : 'text-[var(--text-muted)]'" class="w-3 h-3" />
                Au moins 6 caractères
              </li>
              <li class="flex items-center gap-2">
                <Check :class="form.password === form.confirmPassword && form.password ? 'text-[var(--color-success)]' : 'text-[var(--text-muted)]'" class="w-3 h-3" />
                Les mots de passe correspondent
              </li>
            </ul>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3">
            <input
              v-model="acceptTerms"
              type="checkbox"
              id="terms"
              class="mt-1 w-4 h-4 rounded border-(--border-medium) text-[var(--color-primary)] focus:ring-(--color-primary) focus:ring-2 focus:ring-offset-2"
            />
            <label for="terms" class="text-sm text-[var(--text-secondary)] flex-1">
              J'accepte les
              <a href="#" class="text-[var(--color-primary)] hover:underline font-medium">
                conditions générales
              </a>
              et la
              <a href="#" class="text-[var(--color-primary)] hover:underline font-medium">
                politique de confidentialité
              </a>
            </label>
          </div>

          <!-- Error Message -->
          <Alert
            v-if="error"
            variant="error"
            closeable
            @close="error = null"
          >
            {{ error }}
          </Alert>

          <!-- Success Message -->
          <Alert
            v-if="success"
            variant="success"
          >
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5" />
              <span>Inscription réussie ! Redirection vers la connexion...</span>
            </div>
          </Alert>

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="loading"
            :disabled="!isFormValid"
          >
            <UserPlus v-if="!loading" class="w-5 h-5" />
            {{ loading ? t('common.loading') : t('auth.register.submit') }}
          </Button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-(--border-light)"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-(--bg-primary) text-[var(--text-muted)]">
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
              <span class="text-sm font-medium text-[var(--text-primary)]">Google</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-(--border-medium) rounded-lg hover:bg-(--bg-hover) transition-smooth"
            >
              <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-sm font-medium text-[var(--text-primary)]">Facebook</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-8 py-6 bg-(--bg-secondary) border-t border-(--border-light) text-center">
          <p class="text-sm text-[var(--text-secondary)]">
            {{ t('auth.register.hasAccount') }}
            <router-link
              to="/login"
              class="text-[var(--color-primary)] hover:text-[var(--color-primary-700)] font-semibold"
            >
              {{ t('auth.register.loginLink') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Additional Links -->
      <div class="mt-8 text-center space-y-2">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth"
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
import { useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import Alert from '../components/ui/Alert.vue'
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Info,
  Check,
  CheckCircle,
  ArrowLeft,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  password: '',
  confirmPassword: '',
  telephone: '',
})

const errors = reactive({
  prenom: '',
  nom: '',
  email: '',
  password: '',
  confirmPassword: '',
  telephone: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)

const isFormValid = computed(() => {
  return (
    form.prenom &&
    form.nom &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 6 &&
    acceptTerms.value &&
    !errors.prenom &&
    !errors.nom &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword
  )
})

const validatePrenom = () => {
  if (!form.prenom) {
    errors.prenom = 'Le prénom est requis'
  } else if (form.prenom.length < 2) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères'
  } else {
    errors.prenom = ''
  }
}

const validateNom = () => {
  if (!form.nom) {
    errors.nom = 'Le nom est requis'
  } else if (form.nom.length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères'
  } else {
    errors.nom = ''
  }
}

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
  
  // Also validate confirm password if it has value
  if (form.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'La confirmation est requise'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  } else {
    errors.confirmPassword = ''
  }
}

const handleSubmit = async () => {
  // Validate all fields
  validatePrenom()
  validateNom()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (!acceptTerms.value) {
    error.value = 'Vous devez accepter les conditions générales'
    return
  }

  if (!isFormValid.value) return

  loading.value = true
  error.value = null
  success.value = false

  try {
    // Créer un objet sans confirmPassword pour l'envoi au backend
    const { confirmPassword, ...registerData } = form
    await authStore.register(registerData)
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
