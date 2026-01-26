import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CACHE_TTL') return 300;
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set and get', () => {
    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value);
      const result = await service.get(key);

      expect(result).toEqual(value);
    });

    it('should return undefined for non-existent key', async () => {
      const result = await service.get('non-existent-key');
      expect(result).toBeUndefined();
    });

    it('should return undefined for expired key', async () => {
      const key = 'expired-key';
      const value = { data: 'test-value' };

      // Set with very short TTL (1 second)
      await service.set(key, value, 1);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      const result = await service.get(key);
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a key', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value);
      await service.del(key);

      const result = await service.get(key);
      expect(result).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should clear all cache', async () => {
      const key1 = 'test-key-1';
      const key2 = 'test-key-2';
      const value = { data: 'test-value' };

      await service.set(key1, value);
      await service.set(key2, value);
      await service.reset();

      const result1 = await service.get(key1);
      const result2 = await service.get(key2);

      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
    });
  });

  describe('cache key generators', () => {
    it('should generate product key', () => {
      const productId = '123';
      const key = service.getProductKey(productId);
      expect(key).toBe('product:123');
    });

    it('should generate category key', () => {
      const categoryId = '456';
      const key = service.getCategoryKey(categoryId);
      expect(key).toBe('category:456');
    });

    it('should generate products key', () => {
      const filters = { category: 'electronics', price: 100 };
      const key = service.getProductsKey(filters);
      expect(key).toBe('products:{"category":"electronics","price":100}');
    });

    it('should generate categories key', () => {
      const key = service.getCategoriesKey();
      expect(key).toBe('categories:all');
    });
  });
});