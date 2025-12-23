import { z } from 'zod';

export const CreateCouponDtoSchema = z.object({
  code: z.string().min(1, 'Code requis'),
  description: z.string().min(1, 'Description requise'),
  type_reduction: z.enum(['POURCENTAGE', 'MONTANT_FIXE']),
  valeur_reduction: z.number().positive('Valeur positive'),
  montant_achat_min: z.number().positive().optional(),
  montant_reduction_max: z.number().positive().optional(),
  limite_utilisation: z.number().int().positive().optional(),
  date_debut: z.string().datetime(),
  date_fin: z.string().datetime(),
});

export type CreateCouponDto = z.infer<typeof CreateCouponDtoSchema>;