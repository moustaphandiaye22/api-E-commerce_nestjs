# Frontend Vue.js - Application E-commerce

Application frontend Vue.js 3 avec intégration complète au backend NestJS.

## 🚀 Fonctionnalités

- ✅ Authentification JWT (connexion, inscription, déconnexion)
- ✅ Gestion automatique des tokens (access + refresh)
- ✅ Store Pinia pour la gestion d'état
- ✅ Vue Router avec routes protégées
- ✅ Client API avec intercepteurs Axios
- ✅ Pages produits avec recherche
- ✅ Profil utilisateur

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── api/              # Clients API
│   │   ├── client.js     # Configuration Axios + intercepteurs
│   │   ├── auth.js       # API d'authentification
│   │   ├── products.js   # API produits
│   │   └── users.js      # API utilisateurs
│   ├── stores/           # Stores Pinia
│   │   ├── auth.js       # Store authentification
│   │   └── products.js   # Store produits
│   ├── router/           # Configuration Vue Router
│   │   └── index.js      # Routes et guards
│   ├── views/            # Pages de l'application
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   └── Profile.vue
│   ├── App.vue           # Composant racine
│   └── main.js           # Point d'entrée
├── index.html
├── vite.config.js        # Configuration Vite + proxy
└── package.json
```

## 🛠️ Installation et démarrage

### Prérequis
- Node.js v18+ installé
- Backend NestJS démarré sur le port 3000

### Commandes

```bash
# Installer les dépendances
cd frontend
npm install

# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

## 🔐 Authentification

Le système d'authentification gère automatiquement:
- Stockage des tokens JWT dans localStorage
- Ajout automatique du token dans les headers
- Rafraîchissement automatique du token expiré
- Redirection vers /login si non authentifié

## 📡 API Client

Le client API (`src/api/client.js`) inclut:
- Base URL configurée sur `/api` (proxy vers backend)
- Intercepteur de requête pour le token JWT
- Intercepteur de réponse pour gérer les erreurs 401
- Rafraîchissement automatique des tokens

## 🔒 Routes protégées

Routes nécessitant une authentification:
- `/profile` - Profil utilisateur

Le guard de navigation vérifie l'authentification et redirige vers `/login` si nécessaire.

## 🎨 Personnalisation

Pour adapter l'application:
1. Modifiez les couleurs dans les styles de `App.vue`
2. Ajoutez de nouvelles routes dans `router/index.js`
3. Créez de nouveaux stores dans `stores/`
4. Ajoutez de nouveaux clients API dans `api/`

## 📝 Utilisation des stores

```javascript
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'

const authStore = useAuthStore()
const productsStore = useProductsStore()

// Connexion
await authStore.login({ email, password })

// Récupérer les produits
await productsStore.fetchProducts()
```

## 🔧 Configuration du proxy

Le fichier `vite.config.js` configure un proxy qui redirige les requêtes `/api/*` vers `http://localhost:3000`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 📦 Dépendances principales

- **Vue 3** - Framework frontend
- **Vue Router** - Gestion des routes
- **Pinia** - Store de gestion d'état
- **Axios** - Client HTTP
- **Vite** - Build tool

## 🚀 Production

```bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```