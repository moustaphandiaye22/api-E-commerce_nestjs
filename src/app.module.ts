import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { join } from 'path';
import { HealthController } from './common/controllers/health.controller';
import { AuditService } from './common/services/audit.service';
import { CacheModule } from './cache/cache.module';
import { LoggerModule } from './logger/logger.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { APP_GUARD } from '@nestjs/core';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CartsModule } from './modules/carts/carts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import stripeConfig from './config/stripe.config';
import awsConfig from './config/aws.config';
import mailConfig from './config/mail.config';
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, stripeConfig, awsConfig, mailConfig, cloudinaryConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    CacheModule,
    LoggerModule,
    MonitoringModule,
    PrismaModule,
    AddressesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CollectionsModule,
    CartsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    CouponsModule,
    WishlistsModule,
    NotificationsModule,
    UploadModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    AuditService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
