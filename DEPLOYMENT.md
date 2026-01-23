# 🚀 Guide de Déploiement E-commerce

## Backend (NestJS) - ✅ DÉJÀ DÉPLOYÉ

**URL :** https://api-e-commerce-nestjs-1.onrender.com

**Plateforme :** Render

## Frontend (Vue.js) - Configuration pour Vercel

### 📋 Prérequis

1. **Compte Vercel** : [vercel.com](https://vercel.com)
2. **Repo Git** avec les fichiers configurés

### 🔧 Fichiers de Configuration Créés

#### `vercel.json` (à la racine)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api-e-commerce-nestjs-1.onrender.com"
  }
}
```

#### `frontend/.env.production`
```
VITE_API_URL=https://api-e-commerce-nestjs-1.onrender.com
```

#### `frontend/.env.example`
```bash
# API URL for production
VITE_API_URL=https://api-e-commerce-nestjs-1.onrender.com

# For local development (uncomment if needed)
# VITE_API_URL=http://localhost:3000
```

### 🚀 Étapes de Déploiement

#### 1. **Push sur Git**
```bash
git add .
git commit -m "Configure deployment for Vercel"
git push origin main
```

#### 2. **Connexion Vercel**
- Allez sur [vercel.com](https://vercel.com)
- Connectez votre compte GitHub/GitLab
- Cliquez **"Import Project"**

#### 3. **Configuration du Projet**
- **Sélectionnez votre repo**
- **Framework Preset** : `Vue.js`
- **Root Directory** : `frontend/` (Vercel détectera automatiquement)
- **Build Settings** :
  - Build Command : `npm run build`
  - Output Directory : `dist`
  - Install Command : `npm install`

#### 4. **Variables d'Environnement**
Vercel utilisera automatiquement la configuration du `vercel.json` :
```
VITE_API_URL=https://api-e-commerce-nestjs-1.onrender.com
```

#### 5. **Déploiement**
- Cliquez **"Deploy"**
- Attendez ~2-3 minutes
- ✅ **Votre site sera live !**

### 🌐 URLs Générées

Après déploiement, Vercel vous donnera :
- **Production** : `https://your-project.vercel.app`
- **Preview** : `https://your-project-git-main.vercel.app`

### 🔍 Vérification

Testez ces endpoints sur votre frontend déployé :
- ✅ Page d'accueil
- ✅ Liste des produits
- ✅ Connexion/Inscription
- ✅ Panier et commandes

### 🛠️ Dépannage

#### Si les images ne s'affichent pas :
- Les URLs Unsplash sont déjà configurées dans le seed
- Redéployez le backend pour appliquer les nouvelles URLs

#### Si l'API ne répond pas :
- Vérifiez que `VITE_API_URL` pointe vers Render
- Vérifiez les CORS sur Render

#### Logs de build :
- Allez dans le dashboard Vercel > onglet "Functions"
- Cliquez sur votre déploiement pour voir les logs

### 🎯 Alternative : Autres Plateformes

#### Netlify
```bash
# netlify.toml
[build]
  publish = "frontend/dist"
  command = "cd frontend && npm run build"

[build.environment]
  VITE_API_URL = "https://api-e-commerce-nestjs-1.onrender.com"
```

#### Render Static Site
- **Build Command** : `cd frontend && npm run build`
- **Publish Directory** : `frontend/dist`
- **Environment** : `VITE_API_URL=https://api-e-commerce-nestjs-1.onrender.com`

---

## 🎉 Résultat Final

**URLs de Production :**
- **Frontend** : `https://your-project.vercel.app`
- **Backend API** : `https://api-e-commerce-nestjs-1.onrender.com`

**Votre e-commerce est maintenant 100% déployé et opérationnel !** 🚀