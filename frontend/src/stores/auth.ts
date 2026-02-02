import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authAPI } from '../api/auth'
import { usersAPI } from '../api/users'
import { useApi } from '../composables/useApi'
import type { User, LoginDto, RegisterDto } from '../types/api'

/**
 * Store d'authentification
 * Principe: Single Responsibility - Gère uniquement l'authentification
 * Note: Les getters sont des fonctions pour éviter les problèmes de réactivité avec Pinia
 */
export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref<User | null>(null)
  const { loading, error, execute } = useApi<User>()

  // Getters - Utilisation de fonctions au lieu de computed pour meilleure réactivité
  function isAuthenticated(): boolean {
    return !!user.value
  }
  
  function isAdmin(): boolean {
    return user.value?.role === 'ADMIN'
  }
  
  // Exposer user directement pour l'accès reactif
  function getUser(): User | null {
    return user.value
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async function register(userData: RegisterDto) {
    return execute(
      async () => {
        const response = await authAPI.register(userData)
        return response.data!
      },
      {
        onSuccess: () => {
          // Message de succès déjà dans response.message
        },
      }
    )
  }

  /**
   * Connexion utilisateur
   */
  async function login(credentials: LoginDto) {
    return execute(
      async () => {
        const response = await authAPI.login(credentials)
        // L'API retourne ApiResponse<{ access_token, refresh_token, user }>
        // response.data contient directement les tokens et utilisateur
        const loginData = response.data
        const { access_token, refresh_token, user: userData } = loginData

        // Sauvegarder les tokens
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        // Sauvegarder l'utilisateur
        user.value = userData
        

        return response
      },
      {
        onSuccess: () => {
          
        },
      }
    )
  }

  /**
   * Déconnexion
   */
  async function logout() {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      // Nettoyer l'état local
      user.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  /**
   * Récupérer le profil utilisateur
   */
  async function fetchProfile() {
    return execute(
      async () => {
        const response = await usersAPI.getProfile()
        user.value = response.data!
        return response.data!
      },
      {
        onError: () => {
          // Si échec, déconnecter
          logout()
        },
      }
    )
  }

  /**
   * Initialiser l'authentification au démarrage de l'app
   */
  async function initAuth() {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        await fetchProfile()
      } catch (err) {
        // Si l'authentification échoue, nettoyer
        logout()
      }
    }
  }

  return {
    // État
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    register,
    login,
    logout,
    fetchProfile,
    initAuth,
  }
})