<template>
  <div class="language-selector">
    <button
      @click="toggleDropdown"
      class="language-btn"
      :class="{ active: showDropdown }"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.22 18.22 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span>{{ currentLanguageLabel }}</span>
      <svg class="chevron" :class="{ rotated: showDropdown }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="showDropdown" class="dropdown-menu">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="selectLanguage(lang.code)"
        class="dropdown-item"
        :class="{ active: localeStore.currentLocale === lang.code }"
      >
        <span class="flag">{{ lang.flag }}</span>
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocaleStore } from '../../stores/locale'

const localeStore = useLocaleStore()
const showDropdown = ref(false)

const languages = [
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'en' as const, name: 'English', flag: '🇺🇸' }
]

const currentLanguageLabel = computed(() => {
  const lang = languages.find(l => l.code === localeStore.currentLocale)
  return lang ? lang.name : 'Français'
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectLanguage = (code: 'fr' | 'en') => {
  localeStore.setLocale(code)
  showDropdown.value = false
}

// Fermer le dropdown quand on clique ailleurs
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.language-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.language-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-lighter);
}

.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.chevron {
  width: 12px;
  height: 12px;
  transition: transform var(--transition-fast);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 140px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-bg-hover);
}

.dropdown-item.active {
  background: var(--color-primary-lighter);
  color: var(--color-primary-dark);
  font-weight: var(--font-weight-medium);
}

.flag {
  font-size: 1rem;
}

/* Dark theme */
:global(.dark) .language-btn {
  border-color: var(--color-border-dark);
  background: var(--color-bg-secondary);
}

:global(.dark) .dropdown-menu {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-dark);
}
</style>