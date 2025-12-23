import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  prenom: z.string().min(1, 'Prénom requis'),
  nom: z.string().min(1, 'Nom requis'),
  telephone: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;