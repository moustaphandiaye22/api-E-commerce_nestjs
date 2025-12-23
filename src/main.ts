import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API REST complète pour un système e-commerce')
    .setVersion('1.0')
    .addTag('auth', 'Authentification et autorisation')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('products', 'Gestion des produits')
    .addTag('categories', 'Gestion des catégories')
    .addTag('carts', 'Gestion des paniers')
    .addTag('orders', 'Gestion des commandes')
    .addTag('payments', 'Paiements et transactions')
    .addTag('reviews', 'Avis et commentaires')
    .addTag('coupons', 'Codes promotionnels')
    .addTag('wishlists', 'Listes de souhaits')
    .addTag('notifications', 'Notifications et emails')
    .addTag('upload', 'Upload de fichiers')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
