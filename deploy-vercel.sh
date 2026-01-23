#!/bin/bash

echo "🚀 Déploiement du Frontend E-commerce sur Vercel"
echo "================================================"

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé."
    echo "Installez-le avec : npm install -g vercel"
    exit 1
fi

# Vérifier si on est dans le bon répertoire
if [ ! -d "frontend" ]; then
    echo "❌ Dossier 'frontend' non trouvé. Assurez-vous d'être à la racine du projet."
    exit 1
fi

echo "📦 Installation des dépendances frontend..."
cd frontend
npm install

echo "🔨 Build du projet..."
npm run build

echo "✅ Build terminé. Retour à la racine..."
cd ..

echo "🚀 Déploiement sur Vercel..."
echo "Remarque : Assurez-vous d'être connecté à Vercel (vercel login)"
echo ""

# Configuration Vercel
vercel --prod --yes

echo ""
echo "🎉 Déploiement terminé !"
echo "Votre frontend est maintenant déployé sur Vercel."
echo "URLs générées :"
echo "- Production : https://votre-projet.vercel.app"
echo "- API Backend : https://api-e-commerce-nestjs-1.onrender.com"