import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWatermarkDto } from './dto/create-watermark.dto';

@Injectable()
export class WatermarksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWatermarkDto) {
    return this.prisma.$transaction(async (tx) => {
      // If setting this as the global watermark, unset all other global watermarks
      if (dto.isGlobal) {
        await tx.watermark.updateMany({
          where: { isGlobal: true },
          data: { isGlobal: false },
        });
      }

      return tx.watermark.create({
        data: {
          name: dto.name,
          filepath: dto.filepath,
          opacity: dto.opacity ?? 0.5,
          position: dto.position ?? 'center',
          isGlobal: dto.isGlobal ?? false,
          isActive: dto.isActive ?? true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.watermark.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const watermark = await this.prisma.watermark.findUnique({ where: { id } });
    if (!watermark) {
      throw new NotFoundException(`Watermark not found`);
    }
    return watermark;
  }

  async update(id: string, dto: CreateWatermarkDto) {
    const watermark = await this.prisma.watermark.findUnique({ where: { id } });
    if (!watermark) {
      throw new NotFoundException(`Watermark not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.isGlobal) {
        await tx.watermark.updateMany({
          where: { isGlobal: true, id: { not: id } },
          data: { isGlobal: false },
        });
      }

      return tx.watermark.update({
        where: { id },
        data: {
          name: dto.name,
          filepath: dto.filepath,
          opacity: dto.opacity,
          position: dto.position,
          isGlobal: dto.isGlobal,
          isActive: dto.isActive,
        },
      });
    });
  }

  async remove(id: string) {
    const watermark = await this.prisma.watermark.findUnique({ where: { id } });
    if (!watermark) {
      throw new NotFoundException(`Watermark not found`);
    }

    return this.prisma.watermark.delete({ where: { id } });
  }
}
