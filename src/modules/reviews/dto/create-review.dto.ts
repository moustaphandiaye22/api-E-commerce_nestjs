import { z } from 'zod';

export const CreateReviewDtoSchema = z.object({
  produit_id: z.string().uuid('Produit invalide'),
  note: z.number().int().min(1).max(5, 'Note entre 1 et 5'),
  titre: z.string().min(1, 'Titre requis'),
  commentaire: z.string().min(1, 'Commentaire requis'),
});

export type CreateReviewDto = z.infer<typeof CreateReviewDtoSchema>;