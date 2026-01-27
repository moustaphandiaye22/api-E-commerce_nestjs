<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="modalClasses"
            @click.stop
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-(--border-light)">
              <h3 v-if="title" class="text-xl font-semibold text-(--text-primary)">
                {{ title }}
              </h3>
              <slot v-else name="header" />
              
              <button
                v-if="closeable"
                @click="handleClose"
                class="p-1 rounded-lg hover:bg-(--bg-hover) transition-smooth text-(--text-tertiary) hover:text-(--text-primary)"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-(--border-light)">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeable?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeable: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const modalClasses = computed(() => [
  'relative bg-(--bg-primary) rounded-xl shadow-2xl overflow-hidden',
  'max-h-[90vh] overflow-y-auto',
  {
    'w-full max-w-md': props.size === 'sm',
    'w-full max-w-lg': props.size === 'md',
    'w-full max-w-2xl': props.size === 'lg',
    'w-full max-w-4xl': props.size === 'xl',
    'w-screen h-screen max-w-none rounded-none': props.size === 'full',
  }
])

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
