<template>
  <footer class="bg-(--bg-primary) border-t border-(--border-light) mt-auto">
    <!-- Main Footer -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- Brand Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img src="/images/logos.png" alt="Baobab Market" class="h-10 w-10 object-contain" />
            <span class="text-xl font-bold gradient-text">Baobab Market</span>
          </div>
          <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
            Votre marketplace de confiance pour des produits africains authentiques. 
            Qualité premium et livraison rapide partout en Europe.
          </p>
          <!-- Social Media -->
          <div class="flex items-center gap-3 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-(--bg-secondary) text-[var(--text-secondary)] hover:bg-(--color-primary) hover:text-white transition-smooth"
              aria-label="Facebook"
            >
              <Facebook class="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-(--bg-secondary) text-[var(--text-secondary)] hover:bg-(--color-primary) hover:text-white transition-smooth"
              aria-label="Twitter"
            >
              <Twitter class="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-(--bg-secondary) text-[var(--text-secondary)] hover:bg-(--color-primary) hover:text-white transition-smooth"
              aria-label="Instagram"
            >
              <Instagram class="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-(--bg-secondary) text-[var(--text-secondary)] hover:bg-(--color-primary) hover:text-white transition-smooth"
              aria-label="LinkedIn"
            >
              <Linkedin class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-[var(--text-primary)]">Liens rapides</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Accueil</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/products"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Produits</span>
              </router-link>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>À propos</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-[var(--text-primary)]">Service client</h3>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>FAQ</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Livraison</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Retours</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Politique de confidentialité</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-smooth inline-flex items-center gap-2 group"
              >
                <ChevronRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                <span>Conditions d'utilisation</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-[var(--text-primary)]">Newsletter</h3>
          <p class="text-sm text-[var(--text-secondary)]">
            Inscrivez-vous pour recevoir nos offres exclusives et nouveautés.
          </p>
          <form @submit.prevent="handleSubscribe" class="space-y-3">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                placeholder="Votre email"
                required
                class="w-full px-4 py-2.5 pr-12 rounded-lg border border-(--border-medium) bg-(--bg-secondary) text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth text-sm"
              />
              <button
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-700) transition-smooth"
                :disabled="subscribing"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
            <p v-if="subscribeMessage" class="text-xs text-[var(--color-success)]">
              {{ subscribeMessage }}
            </p>
          </form>
          <!-- Payment Methods -->
          <div class="pt-2">
            <p class="text-xs text-[var(--text-muted)] mb-3">Méthodes de paiement</p>
            <div class="flex items-center gap-2 flex-wrap">
              <div class="px-2 py-1 rounded bg-(--bg-secondary) border border-(--border-light)">
                <CreditCard class="w-6 h-6 text-[var(--text-muted)]" />
              </div>
              <div class="px-2 py-1 rounded bg-(--bg-secondary) border border-(--border-light)">
                <Wallet class="w-6 h-6 text-[var(--text-muted)]" />
              </div>
              <div class="px-2 py-1 rounded bg-(--bg-secondary) border border-(--border-light) text-xs font-semibold text-[var(--text-muted)]">
                PayPal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-(--border-light) bg-(--bg-secondary)">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-[var(--text-muted)] text-center md:text-left">
            © {{ currentYear }} Baobab Market. Tous droits réservés.
          </p>
          <div class="flex items-center gap-6">
            <a
              href="#"
              class="text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-smooth"
            >
              Conditions générales
            </a>
            <a
              href="#"
              class="text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-smooth"
            >
              Confidentialité
            </a>
            <a
              href="#"
              class="text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-smooth"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  Send,
  CreditCard,
  Wallet,
} from 'lucide-vue-next'

const email = ref('')
const subscribing = ref(false)
const subscribeMessage = ref('')

const currentYear = computed(() => new Date().getFullYear())

const handleSubscribe = async () => {
  if (!email.value) return
  
  subscribing.value = true
  
  // Simulate API call
  setTimeout(() => {
    subscribeMessage.value = 'Merci pour votre inscription !'
    email.value = ''
    subscribing.value = false
    
    // Clear message after 3 seconds
    setTimeout(() => {
      subscribeMessage.value = ''
    }, 3000)
  }, 1000)
}
</script>
