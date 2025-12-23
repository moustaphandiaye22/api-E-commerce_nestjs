import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'defaultSecret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m', // 15 minutes for access token
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 7 days for refresh token
}));