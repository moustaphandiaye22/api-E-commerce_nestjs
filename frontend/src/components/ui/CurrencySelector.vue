<template>
  <div class="currency-selector">
    <button
      @click="toggleDisplayMode"
      class="currency-toggle"
      :class="{ active: isDualMode }"
      :title="isDualMode ? 'Afficher en euros uniquement' : 'Afficher euros + FCFA'"
    >
      <svg class="currency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
      </svg>
      <span class="currency-label">{{ displayModeLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCurrency } from '../../composables/useCurrency'

const { isDualMode, displayModeLabel, toggleDisplayMode } = useCurrency()
</script>

<style scoped>
.currency-selector {
  display: flex;
  align-items: center;
}

.currency-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2);
  border: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.currency-toggle:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.currency-toggle.active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.currency-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.currency-label {
  font-weight: var(--font-weight-medium);
}

/* Responsive */
@media (max-width: 768px) {
  .currency-label {
    display: none;
  }

  .currency-toggle {
    padding: var(--spacing-1);
  }
}
</style>