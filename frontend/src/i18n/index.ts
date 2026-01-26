import { ref, computed } from 'vue'
import fr from '../locales/fr.json'
import en from '../locales/en.json'

export type MessageSchema = typeof en

const messages = {
  fr,
  en
}

const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0]
  return messages[browserLang as keyof typeof messages] ? browserLang : 'fr'
}

const getSavedLanguage = (): string => {
  return localStorage.getItem('language') || getBrowserLanguage()
}

// Reactive i18n implementation
const currentLocale = ref<string>(getSavedLanguage())

const locale = computed({
  get: () => ({ value: currentLocale.value }),
  set: (value: { value: string }) => {
    currentLocale.value = value.value
    localStorage.setItem('language', currentLocale.value)
  }
})

function t(key: string): string {
  const keys = key.split('.')
  let value: any = messages[currentLocale.value as keyof typeof messages]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

// Reactive translation function that depends on currentLocale
function useT() {
  return computed(() => {
    return (key: string) => {
      const keys = key.split('.')
      let value: any = messages[currentLocale.value as keyof typeof messages]

      for (const k of keys) {
        value = value?.[k]
      }

      return value || key
    }
  })
}

const reactiveT = useT()

export const i18n = {
  locale,
  t: reactiveT,
  global: {
    locale,
    t: reactiveT
  }
}

export { t, reactiveT, currentLocale, messages }