import { z } from 'zod';

export const CreateOrderDtoSchema = z.object({
  adresse_livraison: z.object({
    rue: z.string(),
    ville: z.string(),
    code_postal: z.string(),
    pays: z.string(),
  }),
  adresse_facturation: z.object({
    rue: z.string(),
    ville: z.string(),
    code_postal: z.string(),
    pays: z.string(),
  }).optional(),
  notes: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;