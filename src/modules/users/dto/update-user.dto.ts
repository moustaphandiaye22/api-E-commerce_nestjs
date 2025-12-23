import { z } from 'zod';

export const UpdateUserDtoSchema = z.object({
  prenom: z.string().min(1).optional(),
  nom: z.string().min(1).optional(),
  telephone: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;