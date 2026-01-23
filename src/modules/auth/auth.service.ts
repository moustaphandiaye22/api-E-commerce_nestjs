import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { HashUtil } from '../../common/utils/hash.util';
import { AuditService } from '../../common/services/audit.service';
import { IAuthService } from './interfaces/auth.interface';
import { UnauthorizedException, ConflictException } from '../../common/exceptions/business.exception';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  async register(data: RegisterDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.uTILISATEURS.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    const hashedPassword = await HashUtil.hash(data.password);
    const user = await this.prisma.uTILISATEURS.create({
      data: {
        email: data.email,
        mot_de_passe_hash: hashedPassword,
        prenom: data.prenom,
        nom: data.nom,
        role: 'USER',
        est_actif: true,
        email_verifie: false,
      },
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        role: true,
        cree_le: true,
      },
    });

    // Audit logging
    this.auditService.logAuthAction('USER_REGISTERED', user.id);

    return { message: 'Utilisateur enregistré avec succès', user };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.uTILISATEURS.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    if (!user.est_actif) {
      throw new UnauthorizedException('Compte désactivé');
    }
    if (!(await HashUtil.compare(data.password, user.mot_de_passe_hash))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    const tokens = await this.generateTokens(payload);

    // Audit logging
    this.auditService.logAuthAction('USER_LOGIN_SUCCESS', user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
      },
    };
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.generateTokens(payload);
  }

  async refreshTokenFromToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'refreshSecret',
      });
      return this.generateTokens(payload);
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'defaultSecret',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret') || 'refreshSecret',
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.uTILISATEURS.findUnique({
      where: { email },
    });
    if (user && (await HashUtil.compare(password, user.mot_de_passe_hash))) {
      return user;
    }
    return null;
  }
}