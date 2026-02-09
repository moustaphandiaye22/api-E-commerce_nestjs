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
 * Helper for optional UUID fields (like category_id)
 * Accepts: valid UUID, undefined, null, or empty string
 * Empty strings are converted to undefined
 */
const optionalUuid = () =>
  z.union([z.string(), z.null(), z.undefined()]).transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional();

export const CreateProductDtoSchema = z.object({
  nom: z.string().trim().min(1, 'Nom requis'),
  description: z.string().min(1, 'Description requise'),
  description_courte: optionalString().default(''),
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
    url_image: z.string().min(1, 'url_image ne peut pas être vide'),
    est_principale: z.boolean().optional().default(false),
  })).optional().default([]),
}).strict();

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
