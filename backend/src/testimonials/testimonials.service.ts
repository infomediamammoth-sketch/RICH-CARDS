import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        name: dto.name,
        message: dto.message,
        videoUrl: dto.videoUrl || null,
        imageUrl: dto.imageUrl || null,
        rating: dto.rating ?? 5,
        isApproved: dto.isApproved ?? false,
        isFeatured: dto.isFeatured ?? false,
      },
    });
  }

  async findAll(onlyApproved = false) {
    return this.prisma.testimonial.findMany({
      where: onlyApproved ? { isApproved: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.testimonial.findMany({
      where: { isApproved: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: CreateTestimonialDto) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial not found`);
    }

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        name: dto.name,
        message: dto.message,
        videoUrl: dto.videoUrl || null,
        imageUrl: dto.imageUrl || null,
        rating: dto.rating ?? 5,
        isApproved: dto.isApproved,
        isFeatured: dto.isFeatured,
      },
    });
  }

  async approve(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial not found`);
    }

    return this.prisma.testimonial.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async remove(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial not found`);
    }

    return this.prisma.testimonial.delete({ where: { id } });
  }
}
