import { IsEnum, IsNotEmpty } from 'class-validator';
import { STATUT_COMMANDE } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(STATUT_COMMANDE, {
    message: `Le statut doit être l'une des valeurs suivantes: ${Object.values(STATUT_COMMANDE).join(', ')}`,
  })
  statut: STATUT_COMMANDE;
}

