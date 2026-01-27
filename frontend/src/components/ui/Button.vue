<template>
  <button :class="buttonClasses" :disabled="disabled || loading" :type="type">
    <Spinner v-if="loading" size="sm" :color="variant === 'primary' ? 'white' : 'primary'" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Spinner from './Spinner.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false,
  loading: false,
  type: 'button'
})

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2',
  'font-medium text-center rounded-lg',
  'transition-smooth cursor-pointer',
  'focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  {
    // Size variants
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-5 py-2.5 text-base': props.size === 'md',
    'px-6 py-3 text-lg': props.size === 'lg',
    
    // Width
    'w-full': props.fullWidth,
    
    // Variant styles
    'bg-(--color-primary) text-white hover:bg-(--color-primary-700) shadow-sm hover:shadow-md': props.variant === 'primary',
    'bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--bg-hover)': props.variant === 'secondary',
    'border border-(--border-medium) bg-transparent text-(--text-primary) hover:bg-(--bg-hover) hover:border-(--color-primary)': props.variant === 'outline',
    'bg-transparent text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)': props.variant === 'ghost',
    'bg-(--color-error) text-white hover:bg-red-600 shadow-sm hover:shadow-md': props.variant === 'danger',
  }
])
</script>
