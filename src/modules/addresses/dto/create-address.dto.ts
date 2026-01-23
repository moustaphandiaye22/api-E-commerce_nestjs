import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum TYPE_ADRESSE {
  LIVRAISON = 'LIVRAISON',
  FACTURATION = 'FACTURATION',
}

export class CreateAddressDto {
  @IsEnum(TYPE_ADRESSE)
  type_adresse: TYPE_ADRESSE;

  @IsString()
  rue: string;

  @IsString()
  ville: string;

  @IsString()
  region: string;

  @IsString()
  code_postal: string;

  @IsString()
  pays: string;

  @IsOptional()
  @IsBoolean()
  par_defaut?: boolean;
}