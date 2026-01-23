# 🛒 E-Commerce API - NestJS + Vue.js

Application e-commerce complète avec backend NestJS et frontend Vue.js, utilisant Neon (PostgreSQL serverless) et Redis pour le cache.

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** avec refresh tokens
- 👤 **Gestion utilisateurs** (Admin/User)
- 🛍️ **Catalogue produits** avec catégories et variantes
- 🛒 **Panier d'achat** persistant
- 💳 **Paiements Stripe** avec webhooks
- 📦 **Gestion commandes** avec suivi des statuts
- 📈 **Gestion stocks** automatique
- ⭐ **Système d'avis** avec modération
- 🎫 **Codes promo** et remises
- 📧 **Notifications email** (optionnel)
- 🔒 **Rate limiting** et sécurité
- 🚀 **Cache Redis** pour les performances
- 🐳 **Déploiement Docker**

## 🛠️ Technologies

- **Backend**: NestJS, TypeScript, Prisma
- **Base de données**: PostgreSQL (Neon serverless)
- **Cache**: Redis
- **Paiements**: Stripe
- **Frontend**: Vue.js 3, Pinia, Vue Router
- **Auth**: JWT + Passport
- **Validation**: Zod
- **API**: RESTful avec Swagger

## 🚀 Installation & Configuration

### Prérequis
- Node.js 20+
- npm ou yarn
- Compte [Neon](https://neon.tech) (PostgreSQL serverless)
- Compte [Stripe](https://stripe.com) (paiements)
- Redis (local ou cloud)

### 1. Cloner et installer

```bash
git clone <repository-url>
cd projet_nest

# Installer les dépendances
npm install
```

### 2. Configuration de la base de données

Créez un projet sur [Neon](https://neon.tech) et copiez l'URL de connexion dans `.env` :

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 3. Configuration Stripe

Créez un compte Stripe et ajoutez les clés :

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Migration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# (Optionnel) Peupler avec des données de test
npx prisma db seed
```

### 5. Lancement

```bash
# Développement
npm run start:dev

# Production
npm run start:prod
```

## 🐳 Déploiement Docker

```bash
# Construire et lancer
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

## 📚 API Documentation

Une fois l'application lancée, accédez à la documentation Swagger :
- **API Backend**: http://localhost:3000/api
- **Frontend**: http://localhost:5173

## 🔧 Scripts disponibles

```bash
# Développement
npm run start:dev          # Avec hot-reload
npm run start:debug        # Avec debugger

# Build & Production
npm run build             # Compiler TypeScript
npm run start:prod        # Lancer en production

# Base de données
npx prisma studio         # Interface graphique DB
npx prisma migrate dev    # Créer une migration
npx prisma generate       # Régénérer le client

# Qualité du code
npm run lint              # Linter ESLint
npm run format            # Formatter Prettier
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## 🏗️ Architecture

```
├── src/
│   ├── modules/           # Modules métier
│   │   ├── auth/         # Authentification JWT
│   │   ├── users/        # Gestion utilisateurs
│   │   ├── products/     # Catalogue produits
│   │   ├── carts/        # Paniers d'achat
│   │   ├── orders/       # Commandes
│   │   ├── payments/     # Paiements Stripe
│   │   └── reviews/      # Avis clients
│   ├── common/           # Utilitaires partagés
│   │   ├── guards/       # Guards sécurité
│   │   ├── interceptors/ # Intercepteurs
│   │   ├── pipes/        # Pipes validation
│   │   └── utils/        # Utilitaires
│   └── config/           # Configuration
├── frontend/             # Application Vue.js
├── prisma/              # Schéma base de données
└── docker-compose.yml   # Configuration Docker
```

## 📡 Endpoints API Principaux

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Refresh token

### Produits
- `GET /products` - Lister les produits (avec filtres)
- `GET /products/:id` - Détail produit
- `POST /products` - Créer produit (Admin)
- `PUT /products/:id` - Modifier produit (Admin)

### Panier & Commandes
- `GET /carts` - Voir son panier
- `POST /carts/items` - Ajouter au panier
- `POST /orders` - Créer commande
- `GET /orders` - Mes commandes

### Paiements
- `POST /payments/create-intent/:orderId` - Créer PaymentIntent
- `POST /payments/webhook` - Webhook Stripe

## 🔒 Sécurité

- **JWT** avec access/refresh tokens
- **Rate limiting** (10 req/minute)
- **Validation** des données entrantes
- **CORS** configuré
- **Guards** pour autorisation
- **Hachage** des mots de passe (bcrypt)

## 📊 Base de Données

Schéma optimisé avec indexes sur :
- `UTILISATEURS.email`
- `UTILISATEURS.role`
- `PRODUITS.nom`
- `PRODUITS.categorie_id`
- `PRODUITS.prix`

## 🚀 Performance

- **Cache Redis** pour les données fréquemment consultées
- **Indexes DB** pour optimiser les requêtes
- **Lazy loading** des relations
- **Pagination** sur les listes

## 📧 Configuration Email (Optionnel)

Pour activer les notifications email :

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre-email@gmail.com
MAIL_PASS=votre-mot-de-passe-app
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT.

---

**Développé avec ❤️ utilisant NestJS et Vue.js**
