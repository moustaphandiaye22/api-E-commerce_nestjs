import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    // Configure Cloudinary from config
    const cloudName = this.configService.get<string>('cloudinary.cloud_name');
    const apiKey = this.configService.get<string>('cloudinary.api_key');
    const apiSecret = this.configService.get<string>('cloudinary.api_secret');
    
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary configured successfully');
    } else {
      // Fallback to direct environment variables
      const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
      const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
      
      if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
        cloudinary.config({
          cloud_name: cloudinaryCloudName,
          api_key: cloudinaryApiKey,
          api_secret: cloudinaryApiSecret,
        });
        this.isConfigured = true;
        this.logger.log('Cloudinary configured successfully from env');
      } else {
        this.logger.error('Cloudinary credentials not configured');
        // Don't fallback to local storage - require Cloudinary
      }
    }
  }

  async uploadImage(file: any, folder: string = 'products'): Promise<string> {
    this.logger.log(`Upload attempt: ${file?.originalname}, size: ${file?.size}, mimetype: ${file?.mimetype}`);
    
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Check if buffer exists
    if (!file?.buffer) {
      this.logger.warn('File buffer is missing - checking for alternative properties');
      // Try to create buffer from arrayBuffer or stream
      if (file.arrayBuffer) {
        try {
          file.buffer = Buffer.from(await file.arrayBuffer());
          this.logger.log('Buffer created from arrayBuffer');
        } catch (e) {
          this.logger.error('Failed to create buffer from arrayBuffer:', e);
        }
      } else if (file.stream) {
        const chunks: Buffer[] = [];
        for await (const chunk of file.stream()) {
          chunks.push(Buffer.from(chunk));
        }
        file.buffer = Buffer.concat(chunks);
        this.logger.log('Buffer created from stream');
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      this.logger.warn(`Invalid file type: ${file.mimetype}`);
      throw new BadRequestException('Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF');
    }

    // Validate file size (10MB max for Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.logger.warn(`File too large: ${file.size} bytes`);
      throw new BadRequestException('Fichier trop volumineux (max 10MB)');
    }

    // Ensure buffer exists before upload
    if (!file.buffer) {
      throw new BadRequestException('Impossible de traiter le fichier: buffer manquant');
    }

    // Cloudinary must be configured
    if (!this.isConfigured) {
      this.logger.error('Cloudinary not configured - please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables');
      throw new BadRequestException('Service d\'upload non configuré. Veuillez configurer Cloudinary.');
    }

    // Upload to Cloudinary
    this.logger.log(`Uploading to Cloudinary folder: ecommerce/${folder}`);
    
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ecommerce/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
          ],
          // Generate multiple formats for optimal display
          eager: [
            { width: 300, height: 300, crop: 'fill', quality: 'auto' }, // Thumbnail
            { width: 800, height: 800, crop: 'limit', quality: 'auto' }, // Medium
          ],
          eager_async: true,
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
    
    // Return the original upload URL (not the eager transformation URLs)
    return url;
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      // Only handle Cloudinary URLs
      if (imagePath.includes('cloudinary.com')) {
        // Extract public_id from URL
        const matches = imagePath.match(/\/v\d+\/(?:.*\/)?([^/]+)\.[^.]+$/);
        if (matches && matches[1]) {
          const publicId = matches[1];
          await cloudinary.uploader.destroy(publicId);
          this.logger.log(`Deleted image from Cloudinary: ${publicId}`);
        }
      } else {
        this.logger.warn(`Attempted to delete non-Cloudinary URL: ${imagePath}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting image from Cloudinary: ${error.message}`);
      throw error;
    }
  }

  validateImageUrl(url: string): boolean {
    // Only validate Cloudinary URLs
    if (url.includes('cloudinary.com') && url.includes('upload')) {
      return true;
    }
    // Reject local URLs
    return false;
  }

  /**
   * Check if Cloudinary is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }
}

