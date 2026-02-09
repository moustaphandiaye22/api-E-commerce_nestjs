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
  'bg-(--bg-primary) rounded-xl transition-smooth',
  {
    // Padding variants
    'p-0': props.padding === 'none',
    'p-4': props.padding === 'sm',
    'p-6': props.padding === 'md',
    'p-8': props.padding === 'lg',
    
    // Border
    'border border-(--border-light)': props.bordered,
    
    // Hover effect
    'hover:shadow-lg hover:-translate-y-0.5': props.hover,
  }
])
</script>
