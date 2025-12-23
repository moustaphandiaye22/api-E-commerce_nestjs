import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  prenom: z.string().min(1, 'Prénom requis'),
  nom: z.string().min(1, 'Nom requis'),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;