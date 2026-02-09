import { z } from 'zod';

export const CreateCollectionDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  description: z.string().optional(),
  url_image: z.string().optional(),
  est_active: z.boolean().default(true),
  ordre_tri: z.number().default(0),
});

export type CreateCollectionDto = z.infer<typeof CreateCollectionDtoSchema>;

export const UpdateCollectionDtoSchema = z.object({
  nom: z.string().optional(),
  description: z.string().optional(),
  url_image: z.string().optional(),
  est_active: z.boolean().optional(),
  ordre_tri: z.number().optional(),
});

export type UpdateCollectionDto = z.infer<typeof UpdateCollectionDtoSchema>;

export const AddProductsToCollectionDtoSchema = z.object({
  produit_ids: z.array(z.string().uuid()).min(1, 'Au moins un produit requis'),
});

export type AddProductsToCollectionDto = z.infer<typeof AddProductsToCollectionDtoSchema>;
