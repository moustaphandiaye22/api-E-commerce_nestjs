<template>
  <div :class="avatarClasses">
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <div v-else-if="name" class="flex items-center justify-center w-full h-full font-medium">
      {{ initials }}
    </div>
    <svg
      v-else
      class="w-full h-full p-1 text-[var(--text-tertiary)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>

    <!-- Status Indicator -->
    <span v-if="status" :class="statusClasses" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: true,
})

const imageError = ref(false)

const initials = computed(() => {
  if (!props.name) return ''
  const names = props.name.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return names[0].substring(0, 2).toUpperCase()
})

const avatarClasses = computed(() => [
  'relative inline-flex items-center justify-center overflow-hidden bg-(--bg-tertiary) text-[var(--text-primary)]',
  {
    // Size variants
    'w-6 h-6 text-xs': props.size === 'xs',
    'w-8 h-8 text-sm': props.size === 'sm',
    'w-10 h-10 text-base': props.size === 'md',
    'w-12 h-12 text-lg': props.size === 'lg',
    'w-16 h-16 text-xl': props.size === 'xl',
    'w-20 h-20 text-2xl': props.size === '2xl',
    
    // Shape variants
    'rounded-full': props.rounded,
    'rounded-lg': !props.rounded,
  }
])

const statusClasses = computed(() => [
  'absolute bottom-0 right-0 rounded-full border-2 border-(--bg-primary)',
  {
    // Size variants based on avatar size
    'w-2 h-2': props.size === 'xs' || props.size === 'sm',
    'w-3 h-3': props.size === 'md' || props.size === 'lg',
    'w-4 h-4': props.size === 'xl' || props.size === '2xl',
    
    // Status colors
    'bg-green-500': props.status === 'online',
    'bg-(--text-muted)': props.status === 'offline',
    'bg-yellow-500': props.status === 'away',
    'bg-red-500': props.status === 'busy',
  }
])

const handleImageError = () => {
  imageError.value = true
}
</script>
