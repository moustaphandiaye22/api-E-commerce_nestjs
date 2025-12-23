import { z } from 'zod';

export const AddToCartDtoSchema = z.object({
  produit_id: z.string().uuid('Produit invalide'),
  variante_id: z.string().uuid().optional(),
  quantite: z.number().int().positive('Quantité positive'),
});

export type AddToCartDto = z.infer<typeof AddToCartDtoSchema>;