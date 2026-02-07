import { ref, computed, readonly } from 'vue'
import { formatPriceEur, formatPriceDual, convertEurToXaf, formatPriceXaf } from '../utils/formatters'

export type CurrencyDisplay = 'eur-only' | 'dual'

/**
 * Interface pour les options de devise
 */
interface CurrencyOptions {
  /** Mode d'affichage */
  displayMode: CurrencyDisplay
}

/**
 * Composable pour la gestion des devises
 * Permet de basculer entre affichage Euro seul ou Euro + CFA
 * 
 * Principes SOLID:
 * - Single Responsibility: Gère uniquement l'affichage des devises
 * - Open/Closed: Facile à étendre avec de nouvelles devises
 * - Dependency Injection: Utilisable partout
 * 
 * Principe DRY: Centralise la logique de formatage des prix
 */
export function useCurrency() {
  const displayMode = ref<CurrencyDisplay>('eur-only')

  /**
   * Formater un prix selon le mode d'affichage
   * @param priceEur - Prix en euros
   * @returns Prix formaté selon le mode choisi
   */
  const formatPrice = (priceEur: number): string => {
    if (displayMode.value === 'eur-only') {
      return formatPriceEur(priceEur)
    }
    return formatPriceDual(priceEur)
  }

  /**
   * Formater un prix en Euro seulement
   * @param priceEur - Prix en euros
   * @returns Prix formaté en euros
   */
  const formatPriceInEur = (priceEur: number): string => {
    return formatPriceEur(priceEur)
  }

  /**
   * Formater un prix en CFA seulement
   * @param priceEur - Prix en euros
   * @returns Prix formaté en CFA
   */
  const formatPriceInXaf = (priceEur: number): string => {
    return formatPriceXaf(convertEurToXaf(priceEur))
  }

  /**
   * Basculer entre les modes d'affichage
   */
  const toggleDisplayMode = (): void => {
    displayMode.value = displayMode.value === 'eur-only' ? 'dual' : 'eur-only'
  }

  /**
   * Définir le mode d'affichage
   * @param mode - Nouveau mode d'affichage
   */
  const setDisplayMode = (mode: CurrencyDisplay): void => {
    displayMode.value = mode
  }

  // Computed pour les templates
  const isDualMode = computed(() => displayMode.value === 'dual')
  const displayModeLabel = computed(() =>
    displayMode.value === 'eur-only' ? '€' : '€ + FCFA'
  )

  return {
    // État (readonly pour éviter les modifications externes)
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