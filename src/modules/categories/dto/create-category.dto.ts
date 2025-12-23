import { z } from 'zod';

export const CreateCategoryDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  description: z.string().optional(),
  categorie_parent_id: z.string().uuid().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;