import { z } from 'zod';

/**
 * Helper for optional string fields that may receive empty strings
 * Converts empty strings to undefined for cleaner handling
 */
const optionalString = () =>
  z.union([z.string(), z.null(), z.undefined()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional();

/**
 * Helper for optional number fields that may receive empty strings
 * Converts empty strings to undefined for cleaner handling
 */
const optionalNumber = () =>
  z.union([z.number(), z.string(), z.null(), z.undefined()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }).optional();

/**
 * Helper for optional integer fields (like stock quantities)
 */
const optionalInt = () =>
  z.union([z.number(), z.string(), z.null(), z.undefined()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? undefined : num;
  }).optional();

/**
 * Helper for optional UUID fields (like category_id)
 * Accepts: valid UUID, undefined, null, or empty string
 * Empty strings are converted to undefined
 */
const optionalUuid = () =>
  z.union([z.string(), z.null(), z.undefined()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    // Ne pas valider le format UUID ici pour éviter les erreurs
    // Le service ou la base de données validera si nécessaire
    return val;
  }).optional();

/**
 * Schema de validation pour la mise à jour d'un produit
 * Tous les champs sont optionnels pour permettre des mises à jour partielles
 * Validation assouplie pour éviter les erreurs 400 sur les mises à jour partielles
 * PAS de .strict() pour accepter les champs supplémentaires sans erreur
 */
export const UpdateProductDtoSchema = z.object({
  nom: optionalString(),
  description: optionalString(),
  description_courte: optionalString(),
  sku: optionalString(),
  prix: optionalNumber(),
  categorie_id: optionalUuid(),
  quantite_stock: optionalInt(),
  seuil_stock_bas: optionalInt(),
  marque: optionalString(),
  est_actif: z.boolean().optional(),
  est_vedette: z.boolean().optional(),
  prix_compare: optionalNumber(),
  prix_coutant: optionalNumber(),
  images: z.array(z.object({
    url_image: z.string().min(1, 'url_image ne peut pas être vide'),
    est_principale: z.boolean().optional().default(false),
    texte_alt: z.string().optional().nullable(),
    ordre_tri: z.number().optional().nullable(),
  }).strict()).optional().nullable(),
}).passthrough(); // Allow extra fields that will be ignored

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;

