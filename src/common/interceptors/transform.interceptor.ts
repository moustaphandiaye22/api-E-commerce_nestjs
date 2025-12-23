import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message: this.getSuccessMessage(context),
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const method = context.getHandler().name;
    const controller = context.getClass().name;

    // Messages par défaut selon l'opération
    if (method.includes('find') || method.includes('get')) return 'Données récupérées avec succès';
    if (method.includes('create')) return 'Ressource créée avec succès';
    if (method.includes('update')) return 'Ressource mise à jour avec succès';
    if (method.includes('delete') || method.includes('remove')) return 'Ressource supprimée avec succès';

    return 'Opération réussie';
  }
}