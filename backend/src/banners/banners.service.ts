import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBannerDto) {
    return this.prisma.heroBanner.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle || null,
        imageUrl: dto.imageUrl || null,
        videoUrl: dto.videoUrl || null,
        ctaLink: dto.ctaLink || null,
        ctaText: dto.ctaText || null,
        displayOrder: dto.displayOrder ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(onlyActive = false) {
    const now = new Date();
    
    if (onlyActive) {
      return this.prisma.heroBanner.findMany({
        where: {
          isActive: true,
          OR: [
            { startDate: null, endDate: null },
            {
              startDate: { lte: now },
              endDate: { gte: now },
            },
          ],
        },
        orderBy: { displayOrder: 'asc' },
      });
    }

    return this.prisma.heroBanner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async update(id: string, dto: CreateBannerDto) {
    const banner = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner not found`);
    }

    return this.prisma.heroBanner.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle || null,
        imageUrl: dto.imageUrl || null,
        videoUrl: dto.videoUrl || null,
        ctaLink: dto.ctaLink || null,
        ctaText: dto.ctaText || null,
        displayOrder: dto.displayOrder ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string) {
    const banner = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner not found`);
    }

    return this.prisma.heroBanner.delete({ where: { id } });
  }
}
