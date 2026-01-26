import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useLocaleStore } from './stores/locale'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser les stores avant de monter l'application
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const themeStore = useThemeStore()

Promise.all([
  authStore.initAuth(),
  localeStore.initLocale(),
  themeStore.initTheme()
]).finally(() => {
  app.mount('#app')
})