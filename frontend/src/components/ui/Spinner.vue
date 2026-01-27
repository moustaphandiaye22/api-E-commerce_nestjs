<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses" />
    <p v-if="text" class="mt-3 text-sm text-(--text-secondary)">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  centered?: boolean
  color?: 'primary' | 'white' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  centered: false,
  color: 'primary',
})

const containerClasses = computed(() => [
  'flex flex-col items-center justify-center',
  {
    'min-h-screen': props.centered,
  }
])

const spinnerClasses = computed(() => [
  'animate-spin rounded-full border-2 border-solid',
  {
    // Size variants
    'w-4 h-4 border-2': props.size === 'sm',
    'w-8 h-8 border-2': props.size === 'md',
    'w-12 h-12 border-3': props.size === 'lg',
    'w-16 h-16 border-4': props.size === 'xl',
    
    // Color variants
    'border-(--border-light) border-t-(--color-primary)': props.color === 'primary',
    'border-white/20 border-t-white': props.color === 'white',
    'border-(--border-light) border-t-(--text-tertiary)': props.color === 'gray',
  }
])
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.6s linear infinite;
}
</style>