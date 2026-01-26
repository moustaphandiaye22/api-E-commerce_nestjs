import { computed } from 'vue'
import { currentLocale, messages } from '../i18n/index'

export function useI18n() {
  const t = computed(() => {
    return (key: string) => {
      const keys = key.split('.')
      let value: any = messages[currentLocale.value as keyof typeof messages]

      for (const k of keys) {
        value = value?.[k]
      }

      return value || key
    }
  })

  return { t }
}