<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: false,
  dot: false,
})

const badgeClasses = computed(() => [
  'inline-flex items-center justify-center font-medium transition-smooth',
  {
    // Size variants
    'px-2 py-0.5 text-xs': props.size === 'sm',
    'px-2.5 py-1 text-sm': props.size === 'md',
    'px-3 py-1.5 text-base': props.size === 'lg',
    
    // Shape variants
    'rounded-full': props.rounded || props.dot,
    'rounded-md': !props.rounded && !props.dot,
    
    // Dot variant
    'w-2 h-2 p-0': props.dot,
    
    // Color variants
    'bg-(--color-primary-100) text-(--color-primary-800)': props.variant === 'primary',
    'bg-(--bg-tertiary) text-(--text-primary)': props.variant === 'secondary',
    'bg-(--color-success-light) text-green-800': props.variant === 'success',
    'bg-(--color-warning-light) text-yellow-800': props.variant === 'warning',
    'bg-(--color-error-light) text-red-800': props.variant === 'error',
    'bg-(--color-info-light) text-blue-800': props.variant === 'info',
  }
])
</script>
