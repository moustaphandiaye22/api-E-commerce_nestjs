import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    pRODUITS: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { id: '1', nom: 'Test Product', prix: 100 },
        { id: '2', nom: 'Test Product 2', prix: 200 },
      ];

      mockPrismaService.pRODUITS.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.pRODUITS.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: '1', nom: 'Test Product', prix: 100 };

      mockPrismaService.pRODUITS.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.pRODUITS.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.pRODUITS.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow('Produit non trouvé');
    });
  });
});