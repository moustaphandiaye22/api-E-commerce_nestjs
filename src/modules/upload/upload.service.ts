import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadImage(file: any, folder: string = 'products'): Promise<string> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Fichier trop volumineux (max 5MB)');
    }

    // Generate unique filename
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return relative path
    return `/uploads/${folder}/${filename}`;
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }

  validateImageUrl(url: string): boolean {
    // Basic validation for image URLs
    return url.startsWith('/uploads/') && /\.(jpg|jpeg|png|webp)$/i.test(url);
  }
}