<template>
  <div :class="alertClasses" role="alert">
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div class="shrink-0">
        <svg
          v-if="variant === 'success'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg
          v-else-if="variant === 'error'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg
          v-else-if="variant === 'warning'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 v-if="title" class="font-semibold mb-1">{{ title }}</h4>
        <div class="text-sm">
          <slot />
        </div>
      </div>

      <!-- Close Button -->
      <button
        v-if="closeable"
        @click="$emit('close')"
        class="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-smooth"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  closeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  closeable: false,
})

defineEmits<{
  'close': []
}>()

const alertClasses = computed(() => [
  'rounded-lg p-4 border transition-smooth',
  {
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200': props.variant === 'success',
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200': props.variant === 'error',
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200': props.variant === 'warning',
    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200': props.variant === 'info',
  }
])
</script>
