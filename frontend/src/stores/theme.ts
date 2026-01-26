import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

/**
 * Store de gestion du thème
 * Principe: Single Responsibility - Gère uniquement le thème de l'application
 */
export const useThemeStore = defineStore('theme', () => {
  // État
  const currentTheme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')
  const systemPrefersDark = ref(false)

  // Getters
  const isLight = computed(() => {
    if (currentTheme.value === 'auto') {
      return !systemPrefersDark.value
    }
    return currentTheme.value === 'light'
  })

  const isDark = computed(() => {
    if (currentTheme.value === 'auto') {
      return systemPrefersDark.value
    }
    return currentTheme.value === 'dark'
  })

  const isAuto = computed(() => currentTheme.value === 'auto')

  /**
   * Détecter la préférence système
   */
  function updateSystemPreference() {
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Changer le thème
   */
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  /**
   * Basculer entre sombre et clair
   */
  function toggleTheme() {
    const newTheme = isLight.value ? 'dark' : 'light'
    setTheme(newTheme)
  }

  /**
   * Activer le mode automatique
   */
  function setAutoTheme() {
    setTheme('auto')
  }

  /**
   * Appliquer le thème au DOM
   */
  function applyTheme() {
    const root = document.documentElement

    if (isDark.value) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // Mettre à jour la meta theme-color pour les navigateurs mobiles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark.value ? '#1a1a1a' : '#ffffff')
    }
  }

  /**
   * Initialiser le thème au démarrage
   */
  function initTheme() {
    updateSystemPreference()

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSystemPreference)

    // Appliquer le thème sauvegardé ou détecté
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }

    applyTheme()
  }

  return {
    // État
    currentTheme,
    systemPrefersDark,
    // Getters
    isLight,
    isDark,
    isAuto,
    // Actions
    setTheme,
    toggleTheme,
    setAutoTheme,
    applyTheme,
    initTheme,
  }
})