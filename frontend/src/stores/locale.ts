import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { i18n, t } from '../i18n'

export type Locale = 'fr' | 'en'

/**
 * Store de gestion de la langue
 * Principe: Single Responsibility - Gère uniquement la langue de l'application
 */
export const useLocaleStore = defineStore('locale', () => {
  // État
  const currentLocale = ref<Locale>((localStorage.getItem('language') as Locale) || 'fr')

  // Getters
  const isFrench = computed(() => currentLocale.value === 'fr')
  const isEnglish = computed(() => currentLocale.value === 'en')

  /**
   * Changer la langue
   */
  function setLocale(locale: Locale) {
    currentLocale.value = locale
    i18n.locale.value = { value: locale }
    localStorage.setItem('language', locale)

    // Mettre à jour la direction du document si nécessaire
    document.documentElement.lang = locale
  }

  /**
   * Basculer entre français et anglais
   */
  function toggleLocale() {
    const newLocale = currentLocale.value === 'fr' ? 'en' : 'fr'
    setLocale(newLocale)
  }

  /**
   * Initialiser la langue au démarrage
   */
  function initLocale() {
    const savedLocale = localStorage.getItem('language') as Locale
    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
      setLocale(savedLocale)
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language.split('-')[0] as Locale
      setLocale(browserLang === 'en' ? 'en' : 'fr')
    }
  }

  return {
    // État
    currentLocale,
    // Getters
    isFrench,
    isEnglish,
    // Actions
    setLocale,
    toggleLocale,
    initLocale,
  }
})