import { z } from 'zod';

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

export const CreateProductDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  description: z.string().min(1, 'Description requise'),
  description_courte: z.string().optional(),
  sku: z.string().min(1, 'SKU requis'),
  prix: z.number().positive('Prix positif requis'),
  categorie_id: optionalUuid(),
  quantite_stock: z.number().int().min(0, 'Stock positif'),
  seuil_stock_bas: z.number().int().min(0).default(5),
  marque: z.string().optional(),
  est_actif: z.boolean().default(true),
  est_vedette: z.boolean().default(false),
  prix_compare: z.number().positive().optional(),
  prix_coutant: z.number().positive().optional(),
  images: z.array(z.object({
    url_image: z.string(),
    est_principale: z.boolean().default(false),
  })).optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
