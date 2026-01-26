import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;
  private isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    this.initializeLogger();
  }

  private initializeLogger() {
    this.ensureLogDirectory();

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return JSON.stringify({
          timestamp,
          level: level.toUpperCase(),
          message,
          service: service || 'baobab-market-api',
          ...meta
        });
      })
    );

    const transports: winston.transport[] = [
      // Écrire tous les logs d'erreur dans error.log
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      // Écrire tous les logs dans combined.log
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ];

    // En développement, ajouter aussi la console
    if (!this.isProduction) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            }),
          ),
        })
      );
    }

    this.logger = winston.createLogger({
      level: this.isProduction ? 'info' : 'debug',
      format: logFormat,
      defaultMeta: { service: 'baobab-market-api' },
      transports,
      exitOnError: false,
    });
  }

  private ensureLogDirectory() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Méthodes spécifiques pour l'audit e-commerce
  logSecurityEvent(event: string, details: any, userId?: string) {
    this.logger.warn(`SECURITY: ${event}`, {
      event,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logBusinessEvent(event: string, details: any, userId?: string) {
    this.logger.info(`BUSINESS: ${event}`, {
      event,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logPerformanceEvent(event: string, duration: number, details?: any) {
    this.logger.info(`PERFORMANCE: ${event} - ${duration}ms`, {
      event,
      duration,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}