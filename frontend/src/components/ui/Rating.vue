<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-0.5">
       <Star
         v-for="star in maxRating"
         :key="star"
         :class="[
           'transition-smooth',
           interactive ? 'cursor-pointer' : '',
           size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
           star <= (hoverRating || rating) ? 'text-[var(--color-warning)]' : 'text-[var(--text-muted)]'
         ]"
         :fill="star <= (hoverRating || rating) ? 'currentColor' : 'none'"
         :stroke="star <= (hoverRating || rating) ? 'currentColor' : 'currentColor'"
         @click="interactive && $emit('update:rating', star)"
         @mouseenter="interactive && (hoverRating = star)"
         @mouseleave="interactive && (hoverRating = 0)"
       />
    </div>
    
    <span v-if="showCount && count !== undefined" class="text-sm text-[var(--text-muted)]">
      ({{ count }})
    </span>

    <span v-if="showValue" class="text-sm font-medium text-[var(--text-secondary)]">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

interface Props {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  showCount?: boolean
  showValue?: boolean
  count?: number
}

withDefaults(defineProps<Props>(), {
  maxRating: 5,
  size: 'md',
  interactive: false,
  showCount: false,
  showValue: false,
})

defineEmits<{
  'update:rating': [rating: number]
}>()

const hoverRating = ref(0)
</script>
