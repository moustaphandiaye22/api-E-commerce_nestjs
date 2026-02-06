import { z } from 'zod';

/**
 * Helper for optional string fields that may receive empty strings
 * Converts empty strings to undefined for cleaner handling
 */
const optionalString = () =>
  z.string().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional().nullable();

/**
 * Helper for optional UUID fields (like category_id)
 * Accepts: valid UUID, undefined, null, or empty string
 * Empty strings are converted to undefined
 */
const optionalUuid = () =>
  z.string().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional().nullable();

/**
 * Schema de validation pour la mise à jour d'un produit
 * Tous les champs sont optionnels pour permettre des mises à jour partielles
 * Validation assouplie pour éviter les erreurs 400 sur les mises à jour partielles
 */
export const UpdateProductDtoSchema = z.object({
  nom: optionalString(),
  description: optionalString(),
  description_courte: optionalString(),
  sku: optionalString(),
  prix: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }).optional().nullable(),
  categorie_id: optionalUuid(),
  quantite_stock: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return val;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? val : num;
  }).optional().nullable(),
  seuil_stock_bas: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return val;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? val : num;
  }).optional().nullable(),
  marque: optionalString(),
  est_actif: z.boolean().optional(),
  est_vedette: z.boolean().optional(),
  prix_compare: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }).optional().nullable(),
  prix_coutant: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }).optional().nullable(),
  images: z.array(z.object({
    url_image: z.string(),
    est_principale: z.boolean().default(false),
  })).optional(),
}).strict(); // Reject unknown fields but only in strict mode

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;

