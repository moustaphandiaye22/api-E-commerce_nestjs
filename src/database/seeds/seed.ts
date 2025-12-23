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
    prisma.pRODUITS.upsert({
      where: { sku: 'PHONE-001' },
      update: {},
      create: {
        nom: 'Smartphone Android',
        slug: 'smartphone-android',
        description: 'Un excellent smartphone Android',
        description_courte: 'Smartphone performant',
        sku: 'PHONE-001',
        prix: 299.99,
        categorie_id: categories[0].id,
        est_actif: true,
        quantite_stock: 50,
        seuil_stock_bas: 10,
      },
    }),
    prisma.pRODUITS.upsert({
      where: { sku: 'TSHIRT-001' },
      update: {},
      create: {
        nom: 'T-shirt Blanc',
        slug: 't-shirt-blanc',
        description: 'T-shirt blanc en coton',
        description_courte: 'T-shirt confortable',
        sku: 'TSHIRT-001',
        prix: 19.99,
        categorie_id: categories[1].id,
        est_actif: true,
        quantite_stock: 100,
        seuil_stock_bas: 20,
      },
    }),
  ]);

  // Seed product images
  await prisma.iMAGES_PRODUITS.createMany({
    data: [
      {
        produit_id: products[0].id,
        url_image: 'https://example.com/phone.jpg',
        texte_alt: 'Smartphone Android',
        est_principale: true,
        ordre_tri: 1,
      },
      {
        produit_id: products[1].id,
        url_image: 'https://example.com/tshirt.jpg',
        texte_alt: 'T-shirt Blanc',
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
    prisma.cOMMANDES.create({
      data: {
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
        produit_id: products[1].id,
        utilisateur_id: users[1].id,
        commande_id: orders[0].id,
        note: 4,
        titre: 'Bon t-shirt',
        commentaire: 'Qualité correcte, taille parfaite.',
        est_verifie: true,
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