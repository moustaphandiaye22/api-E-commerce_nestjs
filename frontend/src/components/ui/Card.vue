<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: false,
  bordered: true
})

const cardClasses = computed(() => [
  'card',
  `card-padding-${props.padding}`,
  { 'card-hover': props.hover },
  { 'card-bordered': props.bordered }
])
</script>

<style scoped>
.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-base);
}

.card-bordered {
  border: var(--border-width) solid var(--color-border-light);
}

.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-padding-none {
  padding: 0;
}

.card-padding-sm {
  padding: var(--spacing-4);
}

.card-padding-md {
  padding: var(--spacing-6);
}

.card-padding-lg {
  padding: var(--spacing-8);
}
</style>