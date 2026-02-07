<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
        >
          <!-- Icon -->
          <div class="toast__icon">
            <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
            <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
            <Info v-else class="w-5 h-5" />
          </div>

          <!-- Message -->
          <div class="toast__message">
            {{ toast.message }}
          </div>

          <!-- Close button -->
          <button
            class="toast__close"
            @click="toastStore.removeToast(toast.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '../../composables/useToast'

const toastStore = useToast()

// Get toasts from store
const toasts = toastStore.toasts
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--bg-primary);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  border-left: 4px solid;
}

.toast--success {
  border-left-color: var(--color-success, #22c55e);
}

.toast--success .toast__icon {
  color: var(--color-success, #22c55e);
}

.toast--error {
  border-left-color: var(--color-error, #ef4444);
}

.toast--error .toast__icon {
  color: var(--color-error, #ef4444);
}

.toast--warning {
  border-left-color: var(--color-warning, #f59e0b);
}

.toast--warning .toast__icon {
  color: var(--color-warning, #f59e0b);
}

.toast--info {
  border-left-color: var(--color-primary, #3b82f6);
}

.toast--info .toast__icon {
  color: var(--color-primary, #3b82f6);
}

.toast__icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast__message {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.toast__close {
  flex-shrink: 0;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.toast__close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Transitions */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
