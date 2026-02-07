/**
 * Script de migration des images vers Cloudinary
 * 
 * Prérequis:
 * - npm install cloudinary dotenv
 * - Configurer les variables dans .env
 * 
 * Utilisation: 
 * cd projet_nest
 * npx ts-node src/scripts/migrate-images-to-cloudinary.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement AVANT de créer PrismaClient
dotenv.config();

// Créer PrismaClient comme dans le projet (avec adapter PostgreSQL)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL non configurée dans .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// URL de base de l'API pour les images locales
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Configuration Cloudinary avec les variables individuelles
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log('✅ Cloudinary configuré avec les variables d\'environnement');
} else {
  // Essayer de parser CLOUDINARY_URL directement
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    // Format: cloudinary://api_key:api_secret@cloud_name
    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      cloudinary.config({
        cloud_name: match[3],
        api_key: match[1],
        api_secret: match[2],
      });
      console.log('✅ Cloudinary configuré avec CLOUDINARY_URL');
    } else {
      console.error('❌ Format CLOUDINARY_URL invalide!');
      process.exit(1);
    }
  } else {
    console.error('❌ CLOUDINARY_URL non configurée!');
    process.exit(1);
  }
}

async function migrateImages() {
  console.log('🚀 Début de la migration des images vers Cloudinary...\n');

  // Vérifier la connexion à la base de données
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }

  console.log(`📡 API Base URL: ${API_BASE_URL}\n`);

  try {
    // Récupérer toutes les images de la base de données
    const images = await prisma.iMAGES_PRODUITS.findMany({
      where: {
        url_image: {
          not: undefined,
        },
      },
    });

    console.log(`📦 ${images.length} images trouvées dans la base de données\n`);

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (const image of images) {
      const currentUrl = image.url_image || '';
      
      // Skip si déjà sur Cloudinary
      if (currentUrl.includes('cloudinary.com')) {
        console.log(`⏭️  Ignorée (déjà sur Cloudinary)`);
        skippedCount++;
        continue;
      }

      // Skip les URLs placeholder ou invalides
      if (currentUrl.includes('example.com') || 
          currentUrl.includes('placeholder') ||
          currentUrl.length < 5) {
        console.log(`⏭️  Ignorée (URL placeholder: ${currentUrl.substring(0, 40)})`);
        skippedCount++;
        continue;
      }

      console.log(`\n📸 Image ID: ${image.id}`);
      console.log(`   URL actuel: ${currentUrl}`);

      try {
        let imageData: string;

        // Récupérer le fichier local ou l'URL distante
        if (currentUrl.startsWith('/images/products/') || currentUrl.startsWith('/uploads/')) {
          // Image locale - construire l'URL complète
          const fullUrl = `${API_BASE_URL}${currentUrl}`;
          console.log(`   🌐 Téléchargement depuis: ${fullUrl}`);
          
          const response = await fetch(fullUrl);
          if (!response.ok) {
            console.log(`   ❌ Échec du téléchargement: ${response.statusText}`);
            failCount++;
            continue;
          }
          const arrayBuffer = await response.arrayBuffer();
          imageData = Buffer.from(arrayBuffer).toString('base64');
        } else if (currentUrl.startsWith('http')) {
          // Image distante
          console.log(`   🌐 Téléchargement depuis: ${currentUrl.substring(0, 60)}...`);
          const response = await fetch(currentUrl);
          if (!response.ok) {
            console.log(`   ❌ Échec du téléchargement: ${response.statusText}`);
            failCount++;
            continue;
          }
          const arrayBuffer = await response.arrayBuffer();
          imageData = Buffer.from(arrayBuffer).toString('base64');
        } else {
          console.log(`   ❌ Format d'URL non reconnu: ${currentUrl}`);
          failCount++;
          continue;
        }

        // Upload vers Cloudinary avec base64
        console.log(`   ☁️  Upload vers Cloudinary...`);
        
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${imageData}`,
          {
            folder: 'ecommerce/products',
            public_id: `product_${image.produit_id}_${image.id}`,
            resource_type: 'image',
          }
        );

        const newUrl = result.secure_url;

        // Mettre à jour la base de données
        await prisma.iMAGES_PRODUITS.update({
          where: { id: image.id },
          data: { url_image: newUrl },
        });

        console.log(`   ✅ Migrée avec succès!`);
        successCount++;

      } catch (error: any) {
        console.log(`   ❌ Erreur: ${error.message}`);
        failCount++;
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(50));
    console.log(`✅ Réussies: ${successCount}`);
    console.log(`⏭️  Ignorées: ${skippedCount} (placeholder ou déjà Cloudinary)`);
    console.log(`❌ Échouées: ${failCount}`);
    console.log('='.repeat(50));

    if (failCount > 0) {
      console.log('\n⚠️  Certaines images n ont pas pu être migrées.');
    } else {
      console.log('\n🎉 Toutes les images ont été migrées!');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateImages();
