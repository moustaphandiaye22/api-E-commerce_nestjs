import { z } from 'zod';

export const AddToWishlistDtoSchema = z.object({
  produit_id: z.string().uuid('Produit invalide'),
});

export type AddToWishlistDto = z.infer<typeof AddToWishlistDtoSchema>;