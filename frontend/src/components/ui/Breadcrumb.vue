<template>
  <nav class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
    <router-link
      v-for="(item, index) in items"
      :key="index"
      :to="item.to"
      class="flex items-center gap-2 hover:text-[var(--color-primary)] transition-smooth"
      :class="{ '!text-[var(--text-primary)] font-medium cursor-default pointer-events-none': index === items.length - 1 }"
    >
      <span>{{ item.label }}</span>
      <ChevronRight v-if="index < items.length - 1" class="w-4 h-4 flex-shrink-0" />
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

interface BreadcrumbItem {
  label: string
  to: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>
