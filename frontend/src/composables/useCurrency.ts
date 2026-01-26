import { ref, computed, readonly } from 'vue'
import { formatPriceEur, formatPriceDual, convertEurToXaf, formatPriceXaf } from '../utils/formatters'

export type CurrencyDisplay = 'eur-only' | 'dual'

/**
 * Composable pour la gestion des devises
 * Permet de basculer entre affichage Euro seul ou Euro + CFA
 */
export function useCurrency() {
  const displayMode = ref<CurrencyDisplay>('eur-only')

  // Prix de référence (toujours en Euro dans la base de données)
  const formatPrice = (priceEur: number) => {
    if (displayMode.value === 'eur-only') {
      return formatPriceEur(priceEur)
    }
    return formatPriceDual(priceEur)
  }

  // Prix en Euro seulement
  const formatPriceInEur = (priceEur: number) => {
    return formatPriceEur(priceEur)
  }

  // Prix en CFA seulement
  const formatPriceInXaf = (priceEur: number) => {
    return formatPriceXaf(convertEurToXaf(priceEur))
  }

  // Basculer entre les modes d'affichage
  const toggleDisplayMode = () => {
    displayMode.value = displayMode.value === 'eur-only' ? 'dual' : 'eur-only'
  }

  // Set display mode
  const setDisplayMode = (mode: CurrencyDisplay) => {
    displayMode.value = mode
  }

  // Computed pour les templates
  const isDualMode = computed(() => displayMode.value === 'dual')
  const displayModeLabel = computed(() =>
    displayMode.value === 'eur-only' ? '€' : '€ + FCFA'
  )

  return {
    // État
    displayMode: readonly(displayMode),
    isDualMode,
    displayModeLabel,

    // Méthodes
    formatPrice,
    formatPriceInEur,
    formatPriceInXaf,
    toggleDisplayMode,
    setDisplayMode,
  }
}