<template>
  <div class="flex items-center justify-center gap-2 flex-wrap">
    <Button
      variant="outline"
      size="sm"
      :disabled="currentPage <= 1"
      @click="$emit('change', currentPage - 1)"
    >
      <ChevronLeft class="w-4 h-4" />
      <span class="hidden sm:inline ml-1">Précédent</span>
    </Button>

    <div class="flex items-center gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="page > 0 && $emit('change', page)"
        :disabled="page < 0"
        class="min-w-[2.5rem] h-10 px-3 rounded-lg text-sm font-medium transition-smooth"
        :class="[
          page === currentPage
            ? 'bg-(--color-primary) text-white'
            : page < 0
            ? 'cursor-default'
            : 'bg-(--bg-primary) text-[var(--text-secondary)] hover:bg-(--bg-hover) hover:text-[var(--color-primary)] border border-(--border-light)'
        ]"
      >
        {{ page < 0 ? '...' : page }}
      </button>
    </div>

    <Button
      variant="outline"
      size="sm"
      :disabled="currentPage >= totalPages"
      @click="$emit('change', currentPage + 1)"
    >
      <span class="hidden sm:inline mr-1">Suivant</span>
      <ChevronRight class="w-4 h-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from './Button.vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7,
})

defineEmits<{
  change: [page: number]
}>()

const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisible } = props
  const pages: number[] = []

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    
    if (currentPage > 4) pages.push(-1) // ellipsis

    const start = Math.max(2, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 3) pages.push(-1) // ellipsis
    
    pages.push(totalPages)
  }

  return pages
})
</script>
