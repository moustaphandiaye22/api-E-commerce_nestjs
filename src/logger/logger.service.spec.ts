import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './logger.service';

describe('CustomLogger', () => {
  let service: CustomLogger;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomLogger,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'development';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CustomLogger>(CustomLogger);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logging methods', () => {
    it('should log info messages', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.log('Test info message', 'TestContext');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log error messages', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      service.error('Test error message', 'stack trace', 'TestContext');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log warning messages', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service.warn('Test warning message', 'TestContext');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log debug messages', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();
      service.debug('Test debug message', 'TestContext');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('business logging methods', () => {
    it('should log security events', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service.logSecurityEvent('LOGIN_FAILED', { ip: '192.168.1.1' }, 'user123');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log business events', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.logBusinessEvent('ORDER_CREATED', { orderId: '123', amount: 100 }, 'user123');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log performance events', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.logPerformanceEvent('API_RESPONSE_TIME', 150, { endpoint: '/api/products' });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});