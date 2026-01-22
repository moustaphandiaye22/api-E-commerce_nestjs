import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { HashUtil } from '../../common/utils/hash.util';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Seed categories
  const categories = await Promise.all([
    prisma.cATEGORIES.upsert({
      where: { slug: 'electroniques' },
      update: {},
      create: {
        nom: 'Électroniques',
        slug: 'electroniques',
        description: 'Produits électroniques et gadgets',
        est_active: true,
      },
    }),
    prisma.cATEGORIES.upsert({
      where: { slug: 'vetements' },
      update: {},
      create: {
        nom: 'Vêtements',
        slug: 'vetements',
        description: 'Vêtements pour hommes et femmes',
        est_active: true,
      },
    }),
    prisma.cATEGORIES.upsert({
      where: { slug: 'maison' },
      update: {},
      create: {
        nom: 'Maison',
        slug: 'maison',
        description: 'Articles pour la maison',
        est_active: true,
      },
    }),
    prisma.cATEGORIES.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        nom: 'Sports & Loisirs',
        slug: 'sports',
        description: 'Équipements sportifs et loisirs',
        est_active: true,
      },
    }),
    prisma.cATEGORIES.upsert({
      where: { slug: 'beaute' },
      update: {},
      create: {
        nom: 'Beauté & Santé',
        slug: 'beaute',
        description: 'Produits de beauté et bien-être',
        est_active: true,
      },
    }),
    prisma.cATEGORIES.upsert({
      where: { slug: 'livres' },
      update: {},
      create: {
        nom: 'Livres',
        slug: 'livres',
        description: 'Livres et littérature',
        est_active: true,
      },
    }),
  ]);

  // Seed users
  const hashedPassword = await HashUtil.hash('password123');
  const users = await Promise.all([
    prisma.uTILISATEURS.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        mot_de_passe_hash: hashedPassword,
        prenom: 'Admin',
        nom: 'User',
        role: 'ADMIN',
        est_actif: true,
        email_verifie: true,
      },
    }),
    prisma.uTILISATEURS.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        mot_de_passe_hash: hashedPassword,
        prenom: 'John',
        nom: 'Doe',
        role: 'USER',
        est_actif: true,
        email_verifie: true,
      },
    }),
  ]);

  // Seed addresses
  await prisma.aDRESSES.createMany({
    data: [
      {
        utilisateur_id: users[1].id,
        type_adresse: 'LIVRAISON',
        rue: '123 Main St',
        ville: 'Paris',
        region: 'Île-de-France',
        code_postal: '75001',
        pays: 'France',
        par_defaut: true,
      },
    ],
    skipDuplicates: true,
  });

  // Seed products
  const products = await Promise.all([
    // Électroniques
    prisma.pRODUITS.upsert({
      where: { sku: 'PHONE-001' },
      update: {},
      create: {
        nom: 'iPhone 15 Pro Max 256GB',
        slug: 'iphone-15-pro-max-256gb',
        description: 'Le dernier iPhone avec caméra professionnelle, écran Super Retina XDR et puce A17 Pro. Parfait pour la photographie, les vidéos et les jeux.',
        description_courte: 'iPhone 15 Pro Max avec caméra avancée',
        sku: 'PHONE-001',
        prix: 1299.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 25,
        seuil_stock_bas: 5,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'PHONE-002' },
      update: {},
      create: {
        nom: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Smartphone Android premium avec S Pen intégré, caméra 200MP et écran Dynamic AMOLED 2X.',
        description_courte: 'Samsung Galaxy S24 Ultra avec S Pen',
        sku: 'PHONE-002',
        prix: 1199.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 30,
        seuil_stock_bas: 5,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'LAPTOP-001' },
      update: {},
      create: {
        nom: 'MacBook Pro 16" M3 Max',
        slug: 'macbook-pro-16-m3-max',
        description: 'Ordinateur portable professionnel avec puce M3 Max, 32GB RAM et 1TB SSD. Idéal pour les développeurs et créatifs.',
        description_courte: 'MacBook Pro 16" pour professionnels',
        sku: 'LAPTOP-001',
        prix: 3499.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 10,
        seuil_stock_bas: 2,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'HEADPHONE-001' },
      update: {},
      create: {
        nom: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Casques sans fil avec réduction de bruit active, autonomie 30h et son haute résolution.',
        description_courte: 'Casques Sony avec ANC premium',
        sku: 'HEADPHONE-001',
        prix: 349.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 45,
        seuil_stock_bas: 8,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'WATCH-001' },
      update: {},
      create: {
        nom: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'Montre connectée avec capteurs de santé avancés, GPS et écran Retina toujours activé.',
        description_courte: 'Apple Watch Series 9 GPS',
        sku: 'WATCH-001',
        prix: 429.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 35,
        seuil_stock_bas: 5,
      },
    }),

    // Vêtements
    prisma.pRODUITS.upsert({
      where: { sku: 'TSHIRT-001' },
      update: {},
      create: {
        nom: 'T-shirt Blanc Premium',
        slug: 't-shirt-blanc-premium',
        description: 'T-shirt blanc 100% coton bio, coupe régulière, parfait pour un look casual élégant.',
        description_courte: 'T-shirt blanc en coton bio',
        sku: 'TSHIRT-001',
        prix: 24.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 120,
        seuil_stock_bas: 15,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'JEANS-001' },
      update: {},
      create: {
        nom: 'Jean Slim Noir',
        slug: 'jean-slim-noir',
        description: 'Jean slim fit en denim stretch, coupe moderne et confortable pour tous les jours.',
        description_courte: 'Jean slim stretch noir',
        sku: 'JEANS-001',
        prix: 79.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 85,
        seuil_stock_bas: 10,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'SWEATER-001' },
      update: {},
      create: {
        nom: 'Pull Col Rond Mérinos',
        slug: 'pull-col-rond-merinos',
        description: 'Pull en laine mérinos extra fine, doux et chaud, parfait pour l\'hiver.',
        description_courte: 'Pull mérinos col rond',
        sku: 'SWEATER-001',
        prix: 89.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 60,
        seuil_stock_bas: 8,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'JACKET-001' },
      update: {},
      create: {
        nom: 'Veste Cuir Noir',
        slug: 'veste-cuir-noir',
        description: 'Veste en cuir véritable, coupe ajustée, style motard avec détails vintage.',
        description_courte: 'Veste cuir style motard',
        sku: 'JACKET-001',
        prix: 299.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 25,
        seuil_stock_bas: 3,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'SHOES-001' },
      update: {},
      create: {
        nom: 'Baskets Blanc Classic',
        slug: 'baskets-blanc-classic',
        description: 'Baskets blanches en cuir, semelle épaisse, style intemporel et confortable.',
        description_courte: 'Baskets blanches classiques',
        sku: 'SHOES-001',
        prix: 129.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 75,
        seuil_stock_bas: 10,
      },
    }),

    // Maison
    prisma.pRODUITS.upsert({
      where: { sku: 'CHAIR-001' },
      update: {},
      create: {
        nom: 'Chaise de Bureau Ergonomique',
        slug: 'chaise-bureau-ergonomique',
        description: 'Chaise de bureau avec soutien lombaire, accoudoirs réglables et assise rembourrée.',
        description_courte: 'Chaise bureau ergonomique',
        sku: 'CHAIR-001',
        prix: 249.99,
        categorie_id: categories[2].id,
        est_actif: true,
        quantite_stock: 40,
        seuil_stock_bas: 5,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'TABLE-001' },
      update: {},
      create: {
        nom: 'Table Basse Scandinave',
        slug: 'table-basse-scandinave',
        description: 'Table basse design scandinave en bois massif, parfaite pour le salon moderne.',
        description_courte: 'Table basse design nordique',
        sku: 'TABLE-001',
        prix: 189.99,
        categorie_id: categories[2].id,
        est_actif: true,
        quantite_stock: 20,
        seuil_stock_bas: 3,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'LAMP-001' },
      update: {},
      create: {
        nom: 'Lampe de Bureau LED',
        slug: 'lampe-bureau-led',
        description: 'Lampe de bureau avec éclairage LED réglable, bras articulé et finition moderne.',
        description_courte: 'Lampe bureau LED articulée',
        sku: 'LAMP-001',
        prix: 79.99,
        categorie_id: categories[2].id,
        est_actif: true,
        quantite_stock: 55,
        seuil_stock_bas: 8,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'COFFEE-001' },
      update: {},
      create: {
        nom: 'Machine à Café Automatique',
        slug: 'machine-cafe-automatique',
        description: 'Machine à café avec broyeur intégré, mousseur à lait et programmation personnalisée.',
        description_courte: 'Machine café automatique premium',
        sku: 'COFFEE-001',
        prix: 599.99,
        categorie_id: categories[2].id,
        est_actif: true,
        quantite_stock: 15,
        seuil_stock_bas: 2,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'BLANKET-001' },
      update: {},
      create: {
        nom: 'Couverture Polaire Douce',
        slug: 'couverture-polaire-douce',
        description: 'Couverture polaire microfibre, douce et chaude, parfaite pour l\'hiver.',
        description_courte: 'Couverture polaire microfibre',
        sku: 'BLANKET-001',
        prix: 49.99,
        categorie_id: categories[2].id,
        est_actif: true,
        quantite_stock: 80,
        seuil_stock_bas: 12,
      },
    }),

    // Sports & Loisirs
    prisma.pRODUITS.upsert({
      where: { sku: 'BIKE-001' },
      update: {},
      create: {
        nom: 'Vélo de Ville Électrique',
        slug: 'velo-ville-electrique',
        description: 'Vélo électrique pliable avec assistance électrique, autonomie 60km, idéal pour la ville.',
        description_courte: 'Vélo électrique pliable',
        sku: 'BIKE-001',
        prix: 1299.99,
        categorie_id: categories[3].id,
        est_actif: true,
        quantite_stock: 12,
        seuil_stock_bas: 2,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'TENNIS-001' },
      update: {},
      create: {
        nom: 'Raquette Tennis Pro',
        slug: 'raquette-tennis-pro',
        description: 'Raquette tennis professionnelle en graphite, poids léger et puissance optimale.',
        description_courte: 'Raquette tennis professionnelle',
        sku: 'TENNIS-001',
        prix: 199.99,
        categorie_id: categories[3].id,
        est_actif: true,
        quantite_stock: 30,
        seuil_stock_bas: 5,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'YOGA-001' },
      update: {},
      create: {
        nom: 'Tapis de Yoga Premium',
        slug: 'tapis-yoga-premium',
        description: 'Tapis de yoga antidérapant, épaisseur 6mm, avec sac de transport inclus.',
        description_courte: 'Tapis yoga antidérapant 6mm',
        sku: 'YOGA-001',
        prix: 69.99,
        categorie_id: categories[3].id,
        est_actif: true,
        quantite_stock: 50,
        seuil_stock_bas: 8,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'GYM-001' },
      update: {},
      create: {
        nom: 'Haltères Ajustables 2-24kg',
        slug: 'halteres-ajustables-2-24kg',
        description: 'Jeu d\'haltères ajustables de 2 à 24kg, parfait pour la musculation à domicile.',
        description_courte: 'Haltères ajustables 2-24kg',
        sku: 'GYM-001',
        prix: 149.99,
        categorie_id: categories[3].id,
        est_actif: true,
        quantite_stock: 25,
        seuil_stock_bas: 4,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'SWIM-001' },
      update: {},
      create: {
        nom: 'Maillot de Bain Homme',
        slug: 'maillot-bain-homme',
        description: 'Maillot de bain homme en polyester rapide séchage, coupe sportive et confortable.',
        description_courte: 'Maillot bain homme sportif',
        sku: 'SWIM-001',
        prix: 39.99,
        categorie_id: categories[3].id,
        est_actif: true,
        quantite_stock: 70,
        seuil_stock_bas: 10,
      },
    }),

    // Beauté & Santé
    prisma.pRODUITS.upsert({
      where: { sku: 'SKINCARE-001' },
      update: {},
      create: {
        nom: 'Crème Hydratante Visage',
        slug: 'creme-hydratante-visage',
        description: 'Crème hydratante anti-âge avec acide hyaluronique et vitamine C, pour tous types de peau.',
        description_courte: 'Crème hydratante anti-âge',
        sku: 'SKINCARE-001',
        prix: 49.99,
        categorie_id: categories[4].id,
        est_actif: true,
        quantite_stock: 90,
        seuil_stock_bas: 15,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'HAIR-001' },
      update: {},
      create: {
        nom: 'Sèche-Cheveux Professionnel',
        slug: 'seche-cheveux-professionnel',
        description: 'Sèche-cheveux professionnel avec ions céramique, 2000W et diffuseur inclus.',
        description_courte: 'Sèche-cheveux professionnel 2000W',
        sku: 'HAIR-001',
        prix: 89.99,
        categorie_id: categories[4].id,
        est_actif: true,
        quantite_stock: 35,
        seuil_stock_bas: 6,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'PERFUME-001' },
      update: {},
      create: {
        nom: 'Parfum Homme Élégant',
        slug: 'parfum-homme-elegant',
        description: 'Parfum homme aux notes de bois de cèdre, musc et agrumes, eau de toilette 100ml.',
        description_courte: 'Parfum homme boisé élégant',
        sku: 'PERFUME-001',
        prix: 79.99,
        categorie_id: categories[4].id,
        est_actif: true,
        quantite_stock: 60,
        seuil_stock_bas: 10,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'MAKEUP-001' },
      update: {},
      create: {
        nom: 'Palette Fards à Paupières',
        slug: 'palette-fards-paupieres',
        description: 'Palette professionnelle de 12 fards à paupières, tons neutres et colorés.',
        description_courte: 'Palette fards paupières 12 tons',
        sku: 'MAKEUP-001',
        prix: 34.99,
        categorie_id: categories[4].id,
        est_actif: true,
        quantite_stock: 75,
        seuil_stock_bas: 12,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'SUPPLEMENTS-001' },
      update: {},
      create: {
        nom: 'Compléments Vitamine D3',
        slug: 'complements-vitamine-d3',
        description: 'Compléments alimentaires vitamine D3 2000UI, 120 gélules pour 4 mois.',
        description_courte: 'Vitamine D3 2000UI - 120 gélules',
        sku: 'SUPPLEMENTS-001',
        prix: 19.99,
        categorie_id: categories[4].id,
        est_actif: true,
        quantite_stock: 100,
        seuil_stock_bas: 20,
      },
    }),

    // Livres
    prisma.pRODUITS.upsert({
      where: { sku: 'BOOK-001' },
      update: {},
      create: {
        nom: 'L\'Art de Programmer',
        slug: 'art-programmer',
        description: 'Guide complet du développement logiciel, des bases aux architectures avancées.',
        description_courte: 'Guide programmation complet',
        sku: 'BOOK-001',
        prix: 39.99,
        categorie_id: categories[5].id,
        est_actif: true,
        quantite_stock: 45,
        seuil_stock_bas: 8,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'BOOK-002' },
      update: {},
      create: {
        nom: 'Cuisine Française Traditionnelle',
        slug: 'cuisine-francaise-traditionnelle',
        description: 'Recettes authentiques de la cuisine française, avec techniques et histoire.',
        description_courte: 'Recettes cuisine française',
        sku: 'BOOK-002',
        prix: 29.99,
        categorie_id: categories[5].id,
        est_actif: true,
        quantite_stock: 55,
        seuil_stock_bas: 10,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'BOOK-003' },
      update: {},
      create: {
        nom: 'Photographie Numérique',
        slug: 'photographie-numerique',
        description: 'Guide complet de la photographie numérique, composition et post-traitement.',
        description_courte: 'Guide photographie numérique',
        sku: 'BOOK-003',
        prix: 34.99,
        categorie_id: categories[5].id,
        est_actif: true,
        quantite_stock: 40,
        seuil_stock_bas: 7,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'BOOK-004' },
      update: {},
      create: {
        nom: 'Roman - Les Misérables',
        slug: 'roman-miserables',
        description: 'Chef-d\'œuvre de Victor Hugo, édition illustrée avec notes et analyse.',
        description_courte: 'Les Misérables - Victor Hugo',
        sku: 'BOOK-004',
        prix: 24.99,
        categorie_id: categories[5].id,
        est_actif: true,
        quantite_stock: 65,
        seuil_stock_bas: 12,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'BOOK-005' },
      update: {},
      create: {
        nom: 'Business Intelligence',
        slug: 'business-intelligence',
        description: 'Stratégies de business intelligence et analyse de données pour entreprises.',
        description_courte: 'Guide business intelligence',
        sku: 'BOOK-005',
        prix: 49.99,
        categorie_id: categories[5].id,
        est_actif: true,
        quantite_stock: 30,
        seuil_stock_bas: 5,
      },
    }),
  ]);

  // Seed product images
  await prisma.iMAGES_PRODUITS.createMany({
    data: [
      // Électroniques - Images externes
      {
        produit_id: products[0].id,
        url_image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        texte_alt: 'iPhone 15 Pro Max 256GB',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[1].id,
        url_image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        texte_alt: 'Samsung Galaxy S24 Ultra',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[2].id,
        url_image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        texte_alt: 'MacBook Pro 16" M3 Max',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[3].id,
        url_image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        texte_alt: 'Sony WH-1000XM5',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[4].id,
        url_image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400',
        texte_alt: 'Apple Watch Series 9',
        est_principale: true,
        ordre_tri: 1,
      },

      // Vêtements
      {
        produit_id: products[5].id,
        url_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        texte_alt: 'T-shirt Blanc Premium',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[6].id,
        url_image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        texte_alt: 'Jean Slim Noir',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[7].id,
        url_image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
        texte_alt: 'Pull Col Rond Mérinos',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[8].id,
        url_image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        texte_alt: 'Veste Cuir Noir',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[9].id,
        url_image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        texte_alt: 'Baskets Blanc Classic',
        est_principale: true,
        ordre_tri: 1,
      },

      // Maison
      {
        produit_id: products[10].id,
        url_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        texte_alt: 'Chaise de Bureau Ergonomique',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[11].id,
        url_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        texte_alt: 'Table Basse Scandinave',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[12].id,
        url_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        texte_alt: 'Lampe de Bureau LED',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[13].id,
        url_image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        texte_alt: 'Machine à Café Automatique',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[14].id,
        url_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        texte_alt: 'Couverture Polaire Douce',
        est_principale: true,
        ordre_tri: 1,
      },

      // Sports & Loisirs
      {
        produit_id: products[15].id,
        url_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        texte_alt: 'Vélo de Ville Électrique',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[16].id,
        url_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        texte_alt: 'Raquette Tennis Pro',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[17].id,
        url_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        texte_alt: 'Tapis de Yoga Premium',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[18].id,
        url_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        texte_alt: 'Haltères Ajustables 2-24kg',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[19].id,
        url_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        texte_alt: 'Maillot de Bain Homme',
        est_principale: true,
        ordre_tri: 1,
      },

      // Beauté & Santé
      {
        produit_id: products[20].id,
        url_image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        texte_alt: 'Crème Hydratante Visage',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[21].id,
        url_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
        texte_alt: 'Sèche-Cheveux Professionnel',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[22].id,
        url_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400',
        texte_alt: 'Parfum Homme Élégant',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[23].id,
        url_image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
        texte_alt: 'Palette Fards à Paupières',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[24].id,
        url_image: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca9?w=400',
        texte_alt: 'Compléments Vitamine D3',
        est_principale: true,
        ordre_tri: 1,
      },

      // Livres
      {
        produit_id: products[25].id,
        url_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        texte_alt: 'L\'Art de Programmer',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[26].id,
        url_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        texte_alt: 'Cuisine Française Traditionnelle',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[27].id,
        url_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        texte_alt: 'Photographie Numérique',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[28].id,
        url_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        texte_alt: 'Roman - Les Misérables',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[29].id,
        url_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        texte_alt: 'Business Intelligence',
        est_principale: true,
        ordre_tri: 1,
      },
    ],
    skipDuplicates: true,
  });

  // Seed product variants
  await prisma.vARIANTES_PRODUITS.createMany({
    data: [
      {
        produit_id: products[0].id,
        sku: 'PHONE-001-BLACK',
        nom: 'Noir',
        prix: 299.99,
        quantite_stock: 25,
        attributs: { couleur: 'noir', stockage: '128GB' },
      },
      {
        produit_id: products[0].id,
        sku: 'PHONE-001-WHITE',
        nom: 'Blanc',
        prix: 299.99,
        quantite_stock: 25,
        attributs: { couleur: 'blanc', stockage: '128GB' },
      },
      {
        produit_id: products[1].id,
        sku: 'TSHIRT-001-S',
        nom: 'Taille S',
        prix: 19.99,
        quantite_stock: 50,
        attributs: { taille: 'S' },
      },
      {
        produit_id: products[1].id,
        sku: 'TSHIRT-001-M',
        nom: 'Taille M',
        prix: 19.99,
        quantite_stock: 50,
        attributs: { taille: 'M' },
      },
    ],
    skipDuplicates: true,
  });

  // Seed carts
  const carts = await Promise.all([
    prisma.pANIERS.upsert({
      where: { session_id: 'cart-session-1' },
      update: {},
      create: {
        utilisateur_id: users[1].id,
        session_id: 'cart-session-1',
      },
    }),
  ]);

  // Get variants for cart items
  const variants = await prisma.vARIANTES_PRODUITS.findMany({
    where: {
      produit_id: { in: products.map(p => p.id) },
    },
  });

  // Seed cart items
  await prisma.aRTICLES_PANIER.createMany({
    data: [
      {
        panier_id: carts[0].id,
        produit_id: products[0].id,
        variante_id: variants[0].id,
        quantite: 1,
        prix_unitaire: 299.99,
      },
      {
        panier_id: carts[0].id,
        produit_id: products[1].id,
        variante_id: variants[2].id,
        quantite: 2,
        prix_unitaire: 19.99,
      },
    ],
    skipDuplicates: true,
  });

  // Seed wishlist
  await prisma.lISTE_SOUHAITS.createMany({
    data: [
      {
        utilisateur_id: users[1].id,
        produit_id: products[0].id,
      },
    ],
    skipDuplicates: true,
  });

  // Seed orders
  const orders = await Promise.all([
    prisma.cOMMANDES.upsert({
      where: { numero_commande: 'ORD-2024-001' },
      update: {},
      create: {
        numero_commande: 'ORD-2024-001',
        utilisateur_id: users[1].id,
        statut: 'LIVRE',
        sous_total: 339.97,
        montant_taxe: 67.99,
        montant_livraison: 5.99,
        montant_reduction: 0,
        montant_total: 413.95,
        adresse_livraison: {
          rue: '123 Main St',
          ville: 'Paris',
          code_postal: '75001',
          pays: 'France',
        },
        adresse_facturation: {
          rue: '123 Main St',
          ville: 'Paris',
          code_postal: '75001',
          pays: 'France',
        },
        notes: 'Livraison express demandée',
      },
    }),
  ]);

  // Seed order items
  await prisma.aRTICLES_COMMANDE.createMany({
    data: [
      {
        commande_id: orders[0].id,
        produit_id: products[0].id,
        variante_id: variants[0].id,
        nom_produit: 'Smartphone Android',
        sku: 'PHONE-001-BLACK',
        quantite: 1,
        prix_unitaire: 299.99,
        total: 299.99,
      },
      {
        commande_id: orders[0].id,
        produit_id: products[1].id,
        variante_id: variants[2].id,
        nom_produit: 'T-shirt Blanc',
        sku: 'TSHIRT-001-S',
        quantite: 2,
        prix_unitaire: 19.99,
        total: 39.98,
      },
    ],
    skipDuplicates: true,
  });

  // Seed payments
  await prisma.pAIEMENTS.createMany({
    data: [
      {
        commande_id: orders[0].id,
        methode_paiement: 'Carte de crédit',
        fournisseur_paiement: 'Stripe',
        id_transaction: 'txn_1234567890',
        montant: 413.95,
        devise: 'EUR',
        statut: 'REUSSI',
        metadonnees: {
          stripe_payment_intent_id: 'pi_1234567890',
          card_last4: '4242',
          card_brand: 'visa',
        },
      },
    ],
    skipDuplicates: true,
  });

  // Seed reviews
  await prisma.aVIS.createMany({
    data: [
      // Reviews for iPhone 15 Pro Max
      {
        produit_id: products[0].id,
        utilisateur_id: users[1].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Excellent smartphone',
        commentaire: 'Très satisfait de cet achat. Performances au rendez-vous.',
        est_verifie: true,
        est_approuve: true,
      },
      {
        produit_id: products[0].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Caméra exceptionnelle',
        commentaire: 'La qualité photo est incroyable, même en basse lumière.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for Samsung Galaxy S24 Ultra
      {
        produit_id: products[1].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 4,
        titre: 'Très bon Android',
        commentaire: 'Interface fluide et S Pen très pratique.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for T-shirt Blanc Premium
      {
        produit_id: products[5].id,
        utilisateur_id: users[1].id,
        commande_id: orders[0].id,
        note: 4,
        titre: 'Bon t-shirt',
        commentaire: 'Qualité correcte, taille parfaite.',
        est_verifie: true,
        est_approuve: true,
      },
      {
        produit_id: products[5].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Excellent rapport qualité-prix',
        commentaire: 'Tissu doux et confortable, lavage parfait.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for Chaise de Bureau
      {
        produit_id: products[10].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Confort absolu',
        commentaire: 'Soutien lombaire parfait pour de longues journées de travail.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for Vélo Électrique
      {
        produit_id: products[15].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 4,
        titre: 'Bon vélo urbain',
        commentaire: 'Assistance électrique bien dosée, facile à plier.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for Crème Hydratante
      {
        produit_id: products[20].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Peau parfaite',
        commentaire: 'Texture légère et absorption rapide. Peau douce toute la journée.',
        est_verifie: false,
        est_approuve: true,
      },

      // Reviews for Livre Programmation
      {
        produit_id: products[25].id,
        utilisateur_id: users[0].id,
        commande_id: orders[0].id,
        note: 5,
        titre: 'Guide excellent',
        commentaire: 'Explications claires et exemples pratiques. Très pédagogique.',
        est_verifie: false,
        est_approuve: true,
      },
    ],
    skipDuplicates: true,
  });

  // Seed coupons
  await prisma.cOUPONS.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: 'Réduction de bienvenue 10%',
      type_reduction: 'POURCENTAGE',
      valeur_reduction: 10,
      date_debut: new Date(),
      date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      est_actif: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });