import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import type { ZodSchema } from 'zod';
import { ValidationException } from '../exceptions/business.exception';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.schema) {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Validation failed: ${errorMessages.join(', ')}`,
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result.data;
  }
}
