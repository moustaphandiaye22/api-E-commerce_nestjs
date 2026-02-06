import { z } from 'zod';

/**
 * Helper for optional string fields that may receive empty strings
 * Converts empty strings to undefined for cleaner handling
 */
const optionalString = () =>
  z.string().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional().nullable();

/**
 * Helper for optional UUID fields (like parent category)
 * Accepts: valid UUID, undefined, null, or empty string
 * Empty strings are converted to undefined
 */
const optionalUuid = () =>
  z.string().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return val;
  }).optional().nullable();

export const CreateCategoryDtoSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  slug: z.string().optional(),
  description: z.string().optional(),
  couleur: z.string().optional(),
  categorie_parent_id: z.string().uuid().optional().nullable(),
});

/**
 * Schema de validation pour la mise à jour d'une catégorie
 * Tous les champs sont optionnels pour permettre des mises à jour partielles
 * Validation assouplie pour éviter les erreurs 400 sur les mises à jour partielles
 */
export const UpdateCategoryDtoSchema = z.object({
  nom: optionalString(),
  slug: optionalString(),
  description: optionalString(),
  couleur: optionalString(),
  categorie_parent_id: optionalUuid(),
  est_active: z.boolean().optional(),
  url_image: optionalString(),
}).strict();

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;

