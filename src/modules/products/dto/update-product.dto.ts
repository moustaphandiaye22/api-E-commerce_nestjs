import { z } from 'zod';

/**
 * Helper for optional UUID fields (like category_id)
 * Accepts: valid UUID, undefined, null, or empty string
 */
const optionalUuid = () =>
  z.string().refine((val) => {
    if (val === undefined || val === null || val === '') return true;
    // Accept UUID or allow it to pass through for service layer handling
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val) || val.length < 36;
  }).optional().nullable();

/**
 * Schema de validation pour la mise à jour d'un produit
 * Tous les champs sont optionnels pour permettre des mises à jour partielles
 * Validation assouplie pour éviter les erreurs 400 sur les mises à jour partielles
 */
export const UpdateProductDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis').optional().nullable(),
  description: z.string().min(1, 'Description requise').optional().nullable(),
  description_courte: z.string().optional().nullable(),
  sku: z.string().min(1, 'SKU requis').optional().nullable(),
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
  marque: z.string().optional().nullable(),
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

