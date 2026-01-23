import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
          },
        },
      },
    },
  })
  async check() {
    // Test database connection
    let dbStatus = 'connected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
      },
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check for Kubernetes/load balancers' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
  })
  async ready() {
    // More comprehensive checks can be added here
    return { status: 'ready' };
  }
}