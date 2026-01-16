/**
 * Types de réponse API conformes au backend NestJS
 */

// Format de réponse standardisé du backend
export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message?: string
  data?: T
  timestamp?: string
  path?: string
}

// Format d'erreur du backend
export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
  timestamp?: string
}

// Utilisateur
export interface User {
  id: string
  email: string
  prenom: string
  nom: string
  role: 'USER' | 'ADMIN'
  est_actif?: boolean
  email_verifie?: boolean
  cree_le?: string
  modifie_le?: string
  adresses?: Address[]
}

// Adresse
export interface Address {
  id: string
  utilisateur_id: string
  type_adresse: 'FACTURATION' | 'LIVRAISON'
  rue: string
  ville: string
  code_postal: string
  pays: string
  est_par_defaut: boolean
}

// Produit
export interface Product {
  id: string
  nom: string
  description?: string
  prix: number
  stock: number
  est_actif: boolean
  categorie_id?: string
  slug?: string
  categorie?: Category
  images_produits?: ProductImage[]
  variantes?: ProductVariant[]
  avis?: Review[]
}

// Catégorie
export interface Category {
  id: string
  nom: string
  slug: string
  description?: string
  parent_id?: string
}

// Image produit
export interface ProductImage {
  id: string
  produit_id: string
  url_image: string
  est_principale: boolean
}

// Variante produit
export interface ProductVariant {
  id: string
  produit_id: string
  nom: string
  prix_supplementaire: number
  stock: number
}

// Avis
export interface Review {
  id: string
  produit_id: string
  utilisateur_id: string
  note: number
  commentaire?: string
  cree_le: string
  utilisateur?: {
    prenom: string
    nom: string
  }
}

// Tokens d'authentification
export interface AuthTokens {
  access_token: string
  refresh_token: string
}

// Réponse de login
export interface LoginResponse extends AuthTokens {
  user: User
}

// DTOs
export interface RegisterDto {
  email: string
  password: string
  prenom: string
  nom: string
}

export interface LoginDto {
  email: string
  password: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Filtres produits
export interface ProductFilters extends PaginationParams {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  inStock?: boolean
}

// Cart - Panier
export interface Cart {
  id: string
  utilisateur_id?: string
  session_id?: string
  cree_le: string
  modifie_le: string
  articles_panier: CartItem[]
}

export interface CartItem {
  id: string
  panier_id: string
  produit_id: string
  variante_id?: string
  quantite: number
  prix_unitaire: string
  produit: Product
  variante?: ProductVariant
}

export interface AddToCartDto {
  produit_id: string
  quantite: number
  variante_id?: string
}

// Order - Commande
export interface Order {
  id: string
  utilisateur_id: string
  numero_commande: string
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_PREPARATION' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE'
  sous_total: string
  montant_taxe: string
  montant_livraison: string
  montant_reduction: string
  montant_total: string
  cree_le: string
  articles_commande: OrderItem[]
  paiements: Payment[]
  adresse_livraison?: Address
  adresse_facturation?: Address
}

export interface OrderItem {
  id: string
  commande_id: string
  produit_id: string
  variante_id?: string
  quantite: number
  prix_unitaire: string
  produit: Product
  variante?: ProductVariant
}

// Payment - Paiement
export interface Payment {
  id: string
  commande_id: string
  montant: string
  devise: string
  statut: 'EN_ATTENTE' | 'REUSSIE' | 'ECHOUEE' | 'REMBOURSEE'
  methode_paiement: string
  fournisseur_paiement: string
  id_transaction?: string
  cree_le: string
  commande?: Order
}

export interface PaymentStats {
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  successRate: number
  totalAmount: string
}

// Coupon
export interface Coupon {
  id: string
  code: string
  description?: string
  type_reduction: 'POURCENTAGE' | 'MONTANT_FIXE'
  valeur_reduction: string
  montant_achat_min?: string
  limite_utilisation?: number
  nombre_utilisations: number
  date_debut?: string
  date_fin?: string
  est_actif: boolean
  cree_le: string
}

export interface ValidateCouponDto {
  code: string
  cartTotal: number
}

export interface CouponValidationResult {
  coupon: Coupon
  discount: number
  finalTotal: number
}

// Wishlist - Liste de souhaits
export interface WishlistItem {
  id: string
  utilisateur_id: string
  produit_id: string
  cree_le: string
  produit: Product
}

// Notification
export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}