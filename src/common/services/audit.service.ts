import { Injectable, Logger } from '@nestjs/common';

export interface AuditLog {
  timestamp?: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  log(auditLog: AuditLog) {
    const logEntry = {
      ...auditLog,
      timestamp: auditLog.timestamp || new Date().toISOString(),
    };

    // Log to console/file (could be enhanced to log to database/external service)
    this.logger.log(`AUDIT: ${JSON.stringify(logEntry)}`);

    // In production, you might want to:
    // - Store in database
    // - Send to logging service (ELK, CloudWatch, etc.)
    // - Send to security monitoring
  }

  // Helper methods for common actions
  logUserAction(userId: string, action: string, details?: any, ip?: string) {
    this.log({
      userId,
      action,
      resource: 'user',
      details,
      ip,
    });
  }

  logAuthAction(action: string, userId?: string, ip?: string, userAgent?: string) {
    this.log({
      userId,
      action,
      resource: 'auth',
      ip,
      userAgent,
    });
  }

  logOrderAction(userId: string, action: string, orderId: string, details?: any) {
    this.log({
      userId,
      action,
      resource: 'order',
      resourceId: orderId,
      details,
    });
  }

  logPaymentAction(userId: string, action: string, paymentId: string, amount?: number) {
    this.log({
      userId,
      action,
      resource: 'payment',
      resourceId: paymentId,
      details: { amount },
    });
  }
}