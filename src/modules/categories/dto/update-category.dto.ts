import { z } from 'zod';

export const CreateCategoryDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  slug: z.string().optional(),
  description: z.string().optional(),
  couleur: z.string().optional(),
  categorie_parent_id: z.string().uuid().optional().nullable(),
});

export const UpdateCategoryDtoSchema = CreateCategoryDtoSchema.partial();

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;

