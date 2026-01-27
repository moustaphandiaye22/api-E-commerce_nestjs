<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-(--text-primary) mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-(--color-error) ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Leading Icon -->
      <div
        v-if="$slots.leading"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
      >
        <slot name="leading" />
      </div>

      <input
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Trailing Icon -->
      <div
        v-if="$slots.trailing"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
      >
        <slot name="trailing" />
      </div>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText && !error"
      class="mt-2 text-xs text-(--text-muted)"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p
      v-if="error"
      class="mt-2 text-xs text-(--color-error) flex items-center gap-1"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  id?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': [event: Event]
  'focus': [event: Event]
}>()

defineOptions({
  inheritAttrs: false
})

const inputClasses = computed(() => [
  'w-full rounded-lg border transition-smooth',
  'bg-(--bg-primary) text-(--text-primary)',
  'focus:outline-hidden focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary)',
  'placeholder:text-(--text-muted)',
  {
    // Size variants
    'px-3 py-2 text-sm': props.size === 'sm',
    'px-4 py-2.5 text-base': props.size === 'md',
    'px-5 py-3 text-lg': props.size === 'lg',
    
    // State variants
    'border-(--border-light) hover:border-(--border-medium)': !props.error && !props.disabled,
    'border-(--color-error) hover:border-(--color-error)': props.error,
    'opacity-60 cursor-not-allowed bg-(--bg-tertiary)': props.disabled,
    'cursor-default bg-(--bg-tertiary)': props.readonly,
    
    // Icon padding
    'pl-10': !!props.$slots?.leading,
    'pr-10': !!props.$slots?.trailing,
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>
