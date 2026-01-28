import { z } from 'zod';

export const CreateReviewDtoSchema = z.object({
  produit_id: z.string().uuid('Produit invalide'),
  note: z.number().int().min(1).max(5, 'Note entre 1 et 5'),
  titre: z.string().optional(),
  commentaire: z.string().min(1, 'Commentaire requis'),
  commande_id: z.string().uuid('Commande invalide').optional(),
});

export type CreateReviewDto = z.infer<typeof CreateReviewDtoSchema>;