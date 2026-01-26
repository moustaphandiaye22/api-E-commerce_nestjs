import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cache = new Map<string, CacheEntry>();

  constructor(private configService: ConfigService) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const entry = this.cache.get(key);
      if (!entry) {
        this.logger.debug(`Cache miss for key: ${key}`);
        return undefined;
      }

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
        this.logger.debug(`Cache expired for key: ${key}`);
        return undefined;
      }

      this.logger.debug(`Cache hit for key: ${key}`);
      return entry.data;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const defaultTtl = this.configService.get('CACHE_TTL', 300); // 5 minutes
      this.cache.set(key, {
        data: value,
        timestamp: Date.now(),
        ttl: ttl || defaultTtl,
      });
      this.logger.debug(`Cache set for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      this.cache.clear();
      this.logger.debug('Cache reset');
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  // Méthodes spécifiques pour l'e-commerce
  getProductKey(id: string): string {
    return `product:${id}`;
  }

  getCategoryKey(id: string): string {
    return `category:${id}`;
  }

  getProductsKey(filters?: any): string {
    const filterStr = filters ? JSON.stringify(filters) : 'all';
    return `products:${filterStr}`;
  }

  getCategoriesKey(): string {
    return 'categories:all';
  }
}