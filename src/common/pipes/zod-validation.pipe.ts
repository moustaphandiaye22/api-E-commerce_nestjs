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
    
    // Log raw incoming data for debugging
    console.log(`[ZodValidationPipe] ${metadata.type} - Raw input:`, JSON.stringify(value, null, 2));
    
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      const validationErrors = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
        received: issue["received"],
        expected: issue["expected"]
      }));
      
      console.error(`[ZodValidationPipe] Validation FAILED:`, {
        errors: validationErrors,
        fullError: result.error.format()
      });
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Validation failed: ${errorMessages.join(', ')}`,
          error: 'Bad Request',
          details: validationErrors,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
    console.log(`[ZodValidationPipe] Validation PASSED - Parsed data:`, JSON.stringify(result.data, null, 2));
    return result.data;
  }
}
