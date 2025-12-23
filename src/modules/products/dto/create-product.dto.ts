import { z } from 'zod';

export const CreateProductDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  description: z.string().min(1, 'Description requise'),
  description_courte: z.string().optional(),
  sku: z.string().min(1, 'SKU requis'),
  prix: z.number().positive('Prix positif requis'),
  categorie_id: z.string().uuid('Catégorie invalide'),
  quantite_stock: z.number().int().min(0, 'Stock positif'),
});

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;