import { Controller, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Uploader une image sur Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Image uploadée avec succès sur Cloudinary',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Image uploadée avec succès' },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/v123456/products/image.jpg' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de l\'upload' })
  async uploadImage(@UploadedFile() file: any) {
    const url = await this.uploadService.uploadImage(file);
    return {
      success: true,
      statusCode: 201,
      message: 'Image uploadée avec succès sur Cloudinary',
      data: { url },
    };
  }
}
