import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { LoginDtoSchema } from './dto/login.dto';
import { RegisterDtoSchema } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiBody({
    description: 'Données d\'inscription',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', minLength: 6, example: 'password123' },
        prenom: { type: 'string', example: 'John' },
        nom: { type: 'string', example: 'Doe' },
      },
      required: ['email', 'password', 'prenom', 'nom'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur inscrit avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Ressource créée avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            email: { type: 'string', example: 'user@example.com' },
            prenom: { type: 'string', example: 'John' },
            nom: { type: 'string', example: 'Doe' },
            role: { type: 'string', example: 'USER' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @UsePipes(new ZodValidationPipe(RegisterDtoSchema))
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({
    description: 'Identifiants de connexion',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Opération réussie' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  @UsePipes(new ZodValidationPipe(LoginDtoSchema))
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token d\'accès' })
  @ApiBody({
    description: 'Token de rafraîchissement',
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens rafraîchis',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Opération réussie' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'nouveau_access_token...' },
            refresh_token: { type: 'string', example: 'nouveau_refresh_token...' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token de rafraîchissement invalide' })
  async refresh(@Body() body: { refresh_token: string }) {
    const tokens = await this.authService.refreshTokenFromToken(body.refresh_token);
    return tokens;
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Déconnexion réussie' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  async logout() {
    return { message: 'Déconnexion réussie' };
  }
}