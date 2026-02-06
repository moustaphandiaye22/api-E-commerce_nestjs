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
 * Helper for optional number fields that may receive empty strings
 * Converts empty strings to undefined for cleaner handling
 */
const optionalNumber = () =>
  z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }).optional().nullable();

/**
 * Helper for optional UUID fields (like category_id)
 * Accepts: valid UUID, undefined, null, or empty string
 * Empty strings are converted to undefined
 */
const optionalUuid = () =>
  z.string().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    // Ne pas valider le format UUID ici pour éviter les erreurs
    // Le service ou la base de données validera si nécessaire
    return val;
  }).optional().nullable();

export const CreateProductDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis').or(z.string().length(0).transform(() => {
    throw new Error('Nom requis');
  })),
  description: z.string().min(1, 'Description requise'),
  description_courte: z.string().optional().default(''),
  sku: z.string().min(1, 'SKU requis'),
  prix: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return 0;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 0;
    return num;
  }),
  categorie_id: optionalUuid(),
  quantite_stock: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return 0;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  }),
  seuil_stock_bas: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === '') return 5;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? 5 : Math.max(0, num);
  }).default(5),
  marque: optionalString(),
  est_actif: z.boolean().default(true),
  est_vedette: z.boolean().default(false),
  prix_compare: optionalNumber(),
  prix_coutant: optionalNumber(),
  images: z.array(z.object({
    url_image: z.string(),
    est_principale: z.boolean().default(false),
  })).optional().default([]),
}).strict();

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
