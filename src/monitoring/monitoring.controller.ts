import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('monitoring')
@Controller('monitoring')
@UseGuards(RolesGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check détaillé' })
  @ApiResponse({ status: 200, description: 'État de santé du système' })
  getHealth() {
    return this.monitoringService.getHealthStatus();
  }

  @Get('metrics')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Métriques détaillées du système' })
  @ApiResponse({ status: 200, description: 'Métriques complètes du système' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux administrateurs' })
  getMetrics() {
    return this.monitoringService.getMetrics();
  }

  @Get('metrics/api')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Métriques API uniquement' })
  @ApiResponse({ status: 200, description: 'Métriques des endpoints API' })
  getApiMetrics() {
    const metrics = this.monitoringService.getMetrics();
    return {
      api: metrics.api,
      timestamp: metrics.timestamp,
    };
  }

  @Get('metrics/database')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Métriques base de données' })
  @ApiResponse({ status: 200, description: 'Métriques des requêtes DB' })
  getDatabaseMetrics() {
    const metrics = this.monitoringService.getMetrics();
    return {
      database: metrics.database,
      timestamp: metrics.timestamp,
    };
  }

  @Get('metrics/cache')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Métriques cache' })
  @ApiResponse({ status: 200, description: 'Métriques du système de cache' })
  getCacheMetrics() {
    const metrics = this.monitoringService.getMetrics();
    return {
      cache: metrics.cache,
      timestamp: metrics.timestamp,
    };
  }
}