import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Ensure upload root folder exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'general',
    applyWatermark = false,
    watermarkId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt);
    const filename = `${Date.now()}-${this.slugify(path.basename(file.originalname, fileExt))}`;
    
    let finalFilename = `${filename}${fileExt}`;
    let finalPath = path.join(folderPath, finalFilename);
    let finalBuffer = file.buffer;
    let isCompressed = false;

    // 1. Process image if applicable
    if (isImage) {
      isCompressed = true;
      finalFilename = `${filename}.webp`;
      finalPath = path.join(folderPath, finalFilename);

      let sharpInstance = sharp(file.buffer);

      // Apply watermark if active
      if (applyWatermark) {
        const watermark = await this.getActiveWatermark(watermarkId);
        if (watermark && fs.existsSync(path.join(process.cwd(), watermark.filepath))) {
          const watermarkBuffer = fs.readFileSync(path.join(process.cwd(), watermark.filepath));
          
          // Resize watermark to be proportionate to main image
          const metadata = await sharpInstance.metadata();
          const wWidth = Math.round((metadata.width || 800) * 0.4); // 40% of parent width

          const resizedWatermark = await sharp(watermarkBuffer)
            .resize(wWidth)
            .png()
            .toBuffer();

          sharpInstance = sharpInstance.composite([
            {
              input: resizedWatermark,
              gravity: 'center',
              blend: 'over',
            },
          ]);
        }
      }

      finalBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
    } else {
      // For videos/PDFs, write directly
      finalBuffer = file.buffer;
    }

    // Write file to disk
    fs.writeFileSync(finalPath, finalBuffer);

    // Save record to DB
    const relativePath = `/uploads/${folder}/${finalFilename}`;
    const media = await this.prisma.media.create({
      data: {
        filename: finalFilename,
        filepath: relativePath,
        sizeBytes: finalBuffer.length,
        format: isImage ? 'webp' : fileExt.replace('.', ''),
        folder,
        isCompressed,
      },
    });

    return media;
  }

  async findAll(folder?: string) {
    return this.prisma.media.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media item not found');
    }

    const diskPath = path.join(process.cwd(), media.filepath);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    return this.prisma.media.delete({ where: { id } });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private async getActiveWatermark(watermarkId?: string) {
    if (watermarkId) {
      return this.prisma.watermark.findUnique({ where: { id: watermarkId } });
    }
    // Fallback to global active watermark
    return this.prisma.watermark.findFirst({
      where: { isGlobal: true, isActive: true },
    });
  }
}
