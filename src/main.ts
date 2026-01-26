import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Compression middleware (will be available after npm install)
let compression: any;
try {
  compression = require('compression');
} catch (error) {
  console.warn('Compression middleware not available, install with: npm install compression');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Compression pour améliorer les performances
  if (compression) {
    app.use(compression({
      level: 6, // Bon compromis entre vitesse et compression
      threshold: 1024, // Compresser seulement les réponses > 1KB
      filter: (req, res) => {
        // Ne pas compresser si déjà compressé ou si c'est une réponse d'erreur
        if (res.getHeader('Content-Encoding')) {
          return false;
        }
        return compression.filter(req, res);
      },
    }));
  }

  // Sécurité : Headers HTTP avec Helmet renforcés
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:", "*.vercel.app", "*.stripe.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }));

  // Configuration CORS pour le frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Local development
      'https://baobabmarketecommerce.vercel.app', // Production Vercel
      /\.vercel\.app$/, // Allow all Vercel domains for preview deployments
      /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Intercepteur global pour standardiser les réponses
  app.useGlobalInterceptors(new TransformInterceptor());

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
