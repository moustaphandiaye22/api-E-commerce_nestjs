import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;