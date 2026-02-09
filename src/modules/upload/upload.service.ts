import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    // Configure Cloudinary from environment variable
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    
    if (cloudinaryUrl) {
      cloudinary.config({
        cloudinary_url: cloudinaryUrl,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary configured successfully');
    } else {
      this.logger.warn('CLOUDINARY_URL not configured - using local storage fallback');
    }
  }

  async uploadImage(file: any, folder: string = 'products'): Promise<string> {
    this.logger.log(`Upload attempt: ${file?.originalname}, size: ${file?.size}, mimetype: ${file?.mimetype}`);
    
    // Check if buffer exists
    if (!file?.buffer) {
      this.logger.warn('File buffer is missing - checking for alternative properties');
      this.logger.warn('File keys:', Object.keys(file || {}));
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // If buffer is missing but file has data, try to create buffer
    if (!file.buffer && file.buffer === undefined) {
      this.logger.warn('Converting file data to buffer...');
      if (file.arrayBuffer) {
        try {
          file.buffer = Buffer.from(await file.arrayBuffer());
          this.logger.log('Buffer created from arrayBuffer');
        } catch (e) {
          this.logger.error('Failed to create buffer:', e);
        }
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      this.logger.warn(`Invalid file type: ${file.mimetype}`);
      throw new BadRequestException('Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.logger.warn(`File too large: ${file.size} bytes`);
      throw new BadRequestException('Fichier trop volumineux (max 5MB)');
    }

    try {
      // Upload to Cloudinary if configured
      if (this.isConfigured) {
        this.logger.log(`Uploading to Cloudinary folder: ${folder}`);
        
        // Ensure buffer exists
        if (!file.buffer) {
          this.logger.warn('Creating buffer from file data for Cloudinary upload');
          if (file.arrayBuffer) {
            file.buffer = Buffer.from(await file.arrayBuffer());
          } else if (file.stream) {
            const chunks: Buffer[] = [];
            for await (const chunk of file.stream()) {
              chunks.push(Buffer.from(chunk));
            }
            file.buffer = Buffer.concat(chunks);
          }
        }
        
        if (!file.buffer) {
          throw new BadRequestException('Impossible de traiter le fichier: buffer manquant');
        }
        
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `ecommerce/${folder}`,
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          // Use streamifier to handle buffer upload
          streamifier.createUploadStream(uploadStream).end(file.buffer);
        });

        const url = result.secure_url;
        this.logger.log(`Cloudinary upload successful: ${url}`);
        return url;
      } else {
        // Fallback to local storage
        return this.uploadLocal(file, folder);
      }
    } catch (error) {
      this.logger.error(`Cloudinary upload failed: ${error.message}`);
      // Try local fallback
      this.logger.warn('Falling back to local storage');
      try {
        return await this.uploadLocal(file, folder);
      } catch (localError) {
        this.logger.error(`Local upload also failed: ${localError.message}`);
        throw new BadRequestException('Échec de l\'upload: ' + error.message);
      }
    }
  }

  /**
   * Local storage fallback - saves to uploads directory
   */
  private async uploadLocal(file: any, folder: string): Promise<string> {
    const fs = await import('fs');
    const path = await import('path');

    // Ensure buffer exists
    if (!file.buffer) {
      this.logger.warn('Creating buffer from file data for local upload');
      if (file.arrayBuffer) {
        file.buffer = Buffer.from(await file.arrayBuffer());
      } else if (file.stream) {
        const chunks: Buffer[] = [];
        for await (const chunk of file.stream()) {
          chunks.push(Buffer.from(chunk));
        }
        file.buffer = Buffer.concat(chunks);
      }
    }

    if (!file.buffer) {
      throw new BadRequestException('Impossible de traiter le fichier: buffer manquant');
    }

    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;

    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${folder}/${filename}`;
    this.logger.log(`Local upload successful: ${url}`);
    return url;
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      // If it's a Cloudinary URL, extract public_id and delete from Cloudinary
      if (imagePath.includes('cloudinary.com')) {
        // Extract public_id from URL
        const matches = imagePath.match(/\/v\d+\/(?:.*\/)?([^/]+)\.[^.]+$/);
        if (matches && matches[1]) {
          const publicId = matches[1];
          await cloudinary.uploader.destroy(publicId);
          this.logger.log(`Deleted image from Cloudinary: ${publicId}`);
        }
      } else if (imagePath.startsWith('/uploads/')) {
        // Local file deletion
        const fs = await import('fs');
        const path = await import('path');
        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          this.logger.log(`Deleted local file: ${fullPath}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error deleting image: ${error.message}`);
    }
  }

  validateImageUrl(url: string): boolean {
    // Validate Cloudinary URLs
    if (url.includes('cloudinary.com') && url.includes('upload')) {
      return true;
    }
    // Validate local URLs
    return url.startsWith('/uploads/') && /\.(jpg|jpeg|png|webp)$/i.test(url);
  }
}
