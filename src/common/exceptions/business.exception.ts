import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from '../enums/http-status.enum';

export class BusinessException extends HttpException {
  constructor(message: string, status: HttpStatusCode = HttpStatusCode.BAD_REQUEST) {
    super(
      {
        statusCode: status,
        message,
        error: HttpStatusCode[status],
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

export class NotFoundException extends BusinessException {
  constructor(resource: string) {
    super(`${resource} non trouvé`, HttpStatusCode.NOT_FOUND);
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'Accès non autorisé') {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Accès interdit') {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}

export class ConflictException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatusCode.CONFLICT);
  }
}