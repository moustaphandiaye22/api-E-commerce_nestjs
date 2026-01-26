import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class MonitoringService {
  constructor(private logger: CustomLogger) {}

  // Métriques de performance
  private metrics = {
    api: {
      totalRequests: 0,
      responseTimes: [] as number[],
      errorCount: 0,
      statusCodes: {} as Record<number, number>,
    },
    database: {
      queryCount: 0,
      slowQueries: 0,
      connectionPoolSize: 0,
    },
    cache: {
      hits: 0,
      misses: 0,
      hitRate: 0,
    },
  };

  // Middleware pour mesurer les temps de réponse API
  recordApiRequest(responseTime: number, statusCode: number, method: string, url: string) {
    this.metrics.api.totalRequests++;
    this.metrics.api.responseTimes.push(responseTime);

    // Garder seulement les 1000 dernières mesures
    if (this.metrics.api.responseTimes.length > 1000) {
      this.metrics.api.responseTimes.shift();
    }

    // Compter les codes de statut
    this.metrics.api.statusCodes[statusCode] = (this.metrics.api.statusCodes[statusCode] || 0) + 1;

    // Logger les erreurs
    if (statusCode >= 400) {
      this.metrics.api.errorCount++;
      this.logger.logSecurityEvent('API_ERROR', {
        statusCode,
        method,
        url,
        responseTime,
      });
    }

    // Logger les requêtes lentes (> 1000ms)
    if (responseTime > 1000) {
      this.logger.logPerformanceEvent('SLOW_API_REQUEST', responseTime, {
        method,
        url,
        statusCode,
      });
    }
  }

  // Métriques de base de données
  recordDatabaseQuery(queryTime: number, query: string) {
    this.metrics.database.queryCount++;

    if (queryTime > 100) { // Requêtes lentes > 100ms
      this.metrics.database.slowQueries++;
      this.logger.logPerformanceEvent('SLOW_DATABASE_QUERY', queryTime, {
        query: query.substring(0, 200), // Limiter la longueur
      });
    }
  }

  // Métriques de cache
  recordCacheHit() {
    this.metrics.cache.hits++;
    this.updateCacheHitRate();
  }

  recordCacheMiss() {
    this.metrics.cache.misses++;
    this.updateCacheHitRate();
  }

  private updateCacheHitRate() {
    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    if (total > 0) {
      this.metrics.cache.hitRate = (this.metrics.cache.hits / total) * 100;
    }
  }

  // Obtenir les métriques actuelles
  getMetrics() {
    const apiResponseTimes = this.metrics.api.responseTimes;
    const avgResponseTime = apiResponseTimes.length > 0
      ? apiResponseTimes.reduce((a, b) => a + b, 0) / apiResponseTimes.length
      : 0;

    const p95ResponseTime = this.calculatePercentile(apiResponseTimes, 95);
    const p99ResponseTime = this.calculatePercentile(apiResponseTimes, 99);

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      api: {
        totalRequests: this.metrics.api.totalRequests,
        averageResponseTime: Math.round(avgResponseTime),
        p95ResponseTime: Math.round(p95ResponseTime),
        p99ResponseTime: Math.round(p99ResponseTime),
        errorCount: this.metrics.api.errorCount,
        errorRate: this.metrics.api.totalRequests > 0
          ? (this.metrics.api.errorCount / this.metrics.api.totalRequests) * 100
          : 0,
        statusCodes: this.metrics.api.statusCodes,
      },
      database: {
        queryCount: this.metrics.database.queryCount,
        slowQueries: this.metrics.database.slowQueries,
        slowQueryRate: this.metrics.database.queryCount > 0
          ? (this.metrics.database.slowQueries / this.metrics.database.queryCount) * 100
          : 0,
      },
      cache: {
        hits: this.metrics.cache.hits,
        misses: this.metrics.cache.misses,
        hitRate: Math.round(this.metrics.cache.hitRate * 100) / 100,
      },
    };
  }

  // Calculer les percentiles
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;

    const sorted = [...sortedArray].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return sorted[lower];
    }

    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  }

  // Health check détaillé
  getHealthStatus() {
    const metrics = this.getMetrics();
    const isHealthy = metrics.api.errorRate < 5 && metrics.database.slowQueryRate < 10;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: metrics.timestamp,
      checks: {
        api: {
          status: metrics.api.errorRate < 5 ? 'healthy' : 'unhealthy',
          errorRate: metrics.api.errorRate,
          averageResponseTime: metrics.api.averageResponseTime,
        },
        database: {
          status: metrics.database.slowQueryRate < 10 ? 'healthy' : 'unhealthy',
          slowQueryRate: metrics.database.slowQueryRate,
          totalQueries: metrics.database.queryCount,
        },
        cache: {
          status: metrics.cache.hitRate > 50 ? 'healthy' : 'warning',
          hitRate: metrics.cache.hitRate,
        },
        memory: {
          status: metrics.memory.heapUsed / metrics.memory.heapTotal < 0.9 ? 'healthy' : 'warning',
          usage: Math.round((metrics.memory.heapUsed / 1024 / 1024) * 100) / 100, // MB
          total: Math.round((metrics.memory.heapTotal / 1024 / 1024) * 100) / 100, // MB
        },
      },
    };
  }

  // Reset des métriques (utile pour les tests)
  resetMetrics() {
    this.metrics = {
      api: {
        totalRequests: 0,
        responseTimes: [],
        errorCount: 0,
        statusCodes: {},
      },
      database: {
        queryCount: 0,
        slowQueries: 0,
        connectionPoolSize: 0,
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
    };
  }
}