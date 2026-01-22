import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsAPI } from '../api/notifications'
import { useApi } from '../composables/useApi'
import type { NotificationsResponse } from '../types/api'

/**
 * Store des notifications
 * Principe: Single Responsibility - Gère uniquement les notifications
 */
export const useNotificationsStore = defineStore('notifications', () => {
  // État
  const notifications = ref<NotificationsResponse['notifications']>([])
  const unreadCount = ref(0)
  const { loading, error, execute } = useApi<NotificationsResponse>()

  /**
   * Récupérer les notifications de l'utilisateur
   */
  async function fetchNotifications() {
    return execute(
      async () => {
        const response = await notificationsAPI.get()
        notifications.value = response.data!.notifications
        unreadCount.value = response.data!.unreadCount
        return response.data!
      }
    )
  }

  /**
   * Marquer une notification comme lue (TODO: implement when backend supports it)
   */
  function markAsRead(notificationId: string) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  function markAllAsRead() {
    notifications.value.forEach(notification => {
      notification.read = true
    })
    unreadCount.value = 0
  }

  return {
    // État
    notifications,
    unreadCount,
    loading,
    error,
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
})