/**
 * Utilitaires de formatage
 * Principe DRY: Fonctions réutilisables pour le formatage
 */

// Taux de conversion Euro vers CFA (fixe pour la démonstration)
const EUR_TO_XAF_RATE = 655.957

/**
 * Convertit un prix en Euro vers CFA
 */
export function convertEurToXaf(eurPrice: number): number {
  return eurPrice * EUR_TO_XAF_RATE
}

/**
 * Formate un prix en euros
 */
export function formatPriceEur(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Formate un prix en Francs CFA
 */
export function formatPriceXaf(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formate un prix avec les deux devises (Euro + CFA)
 */
export function formatPriceDual(priceEur: number): string {
  const priceXaf = convertEurToXaf(priceEur)
  return `${formatPriceEur(priceEur)} (${formatPriceXaf(priceXaf)})`
}

/**
 * Formate un prix simple (rétrocompatibilité)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Formate une date au format français
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }
  return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(dateObj)
}

/**
 * Formate une date et heure au format français
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Tronque un texte à une longueur maximale
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}