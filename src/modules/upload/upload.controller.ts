import { Controller, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Uploader une image' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Image uploadée',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Image uploadée avec succès' },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: '/uploads/products/image.jpg' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  async uploadImage(@UploadedFile() file: any) {
    const url = await this.uploadService.uploadImage(file);
    return {
      message: 'Image uploadée avec succès',
      data: { url },
    };
  }
}