import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditService } from '../../common/services/audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [AddressesService, AuditService],
  exports: [AddressesService],
})
export class AddressesModule {}