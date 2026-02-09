import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpStatusCode } from '../enums/http-status.enum';

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Une erreur est survenue';

      const errorResponse: ApiErrorResponse = {
        success: false,
        statusCode: status,
        message,
        error: HttpStatusCode[status] || 'Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      return response.status(status).json(errorResponse);
    }

    // Handle Prisma errors
    if (exception.code === 'P2002') {
      const target = (exception.meta?.target as string[]) || [];
      let message = 'Une erreur de contrainte s\'est produite';
      if (target.includes('sku')) {
        message = 'Un produit avec ce SKU existe déjà';
      } else if (target.includes('slug')) {
        message = 'Un produit avec ce nom existe déjà';
      } else if (target.includes('email')) {
        message = 'Un utilisateur avec cet email existe déjà';
      }

      return response.status(409).json({
        success: false,
        statusCode: 409,
        message,
        error: 'Conflict',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception.code === 'P2025') {
      return response.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Ressource non trouvée',
        error: 'Not Found',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Handle foreign key constraint errors
    if (exception.code === 'P2003') {
      return response.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Référence invalide - la catégorie spécifiée n\'existe pas',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Handle all other errors (500)
    console.error('Unhandled error:', exception);
    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode: 500,
      message: exception.message || 'Une erreur interne du serveur est survenue',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    return response.status(500).json(errorResponse);
  }
}