import { z } from 'zod';

/**
 * Schema de validation pour la mise à jour d'un produit
 * Tous les champs sont optionnels pour permettre des mises à jour partielles
 */
export const UpdateProductDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis').optional(),
  description: z.string().min(1, 'Description requise').optional(),
  description_courte: z.string().optional().nullable(),
  sku: z.string().min(1, 'SKU requis').optional(),
  prix: z.number().positive('Prix positif requis').optional(),
  categorie_id: z.string().uuid('Catégorie invalide').optional(),
  quantite_stock: z.number().int().min(0, 'Stock positif').optional(),
  seuil_stock_bas: z.number().int().min(0).optional(),
  marque: z.string().optional().nullable(),
  est_actif: z.boolean().optional(),
  est_vedette: z.boolean().optional(),
  prix_compare: z.number().positive().optional().nullable(),
  prix_coutant: z.number().positive().optional().nullable(),
  images: z.array(z.object({
    url_image: z.string(),
    est_principale: z.boolean().default(false),
  })).optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;

