import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import type { ZodSchema } from 'zod';
import { ValidationException } from '../exceptions/business.exception';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.schema) {
      // If no schema provided, try to get from metadata or skip
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      throw new ValidationException(`Erreurs de validation: ${errorMessages.join(', ')}`);
    }
    return result.data;
  }
}