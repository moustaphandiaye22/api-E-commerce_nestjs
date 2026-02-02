import { z } from 'zod';

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
  prix: z.union([z.number(), z.string()]).optional().nullable(),
  // Assouplissement de la validation UUID - accepte string ou null
  categorie_id: z.union([z.string().uuid(), z.string().length(0)]).optional().nullable(),
  quantite_stock: z.union([z.number(), z.string()]).optional().nullable(),
  seuil_stock_bas: z.union([z.number(), z.string()]).optional().nullable(),
  marque: z.string().optional().nullable(),
  est_actif: z.boolean().optional(),
  est_vedette: z.boolean().optional(),
  prix_compare: z.union([z.number(), z.string()]).optional().nullable(),
  prix_coutant: z.union([z.number(), z.string()]).optional().nullable(),
  images: z.array(z.object({
    url_image: z.string(),
    est_principale: z.boolean().default(false),
  })).optional(),
}).passthrough(); // Accepte d'autres champs sans validation stricte

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;

