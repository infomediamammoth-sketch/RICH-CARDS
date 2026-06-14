import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(dto: CreateTemplateDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);

    const existing = await this.prisma.template.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Template with slug '${slug}' already exists`);
    }

    return this.prisma.$transaction(async (tx) => {
      const template = await tx.template.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          price: new Prisma.Decimal(dto.price ?? 0.0),
          previewVideoUrl: dto.previewVideoUrl || null,
          imageUrls: dto.imageUrls || [],
          watermarked: dto.watermarked ?? true,
          watermarkId: dto.watermarkId || null,
          categoryId: dto.categoryId,
          tags: dto.tagIds ? {
            connect: dto.tagIds.map((id) => ({ id })),
          } : undefined,
          displayOrder: dto.displayOrder ?? 0,
        },
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.create({
          data: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            templateId: template.id,
          },
        });
      }

      return tx.template.findUnique({
        where: { id: template.id },
        include: { tags: true, category: true, seoMetadata: true },
      });
    });
  }

  async findAll(query: QueryTemplatesDto) {
    const { category, format, tag, search, sort, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TemplateWhereInput = {};

    // 1. Filter by category
    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
    }

    // 2. Filter by format
    if (format) {
      if (format.toLowerCase() === 'video') {
        where.previewVideoUrl = { not: null };
      } else {
        // Mock matching via tags or extensions
        where.tags = {
          some: {
            slug: { contains: format.toLowerCase() },
          },
        };
      }
    }

    // 3. Filter by tag
    if (tag) {
      where.tags = {
        some: {
          OR: [{ id: tag }, { slug: tag }],
        },
      };
    }

    // 4. Filter by search query
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 5. Build sorting
    let orderBy: Prisma.TemplateOrderByWithRelationInput = { displayOrder: 'asc' };
    if (sort) {
      switch (sort.toLowerCase()) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'popular':
          // Standard ordering by displayOrder or view metrics. We use createdAt and displayOrder
          orderBy = { displayOrder: 'asc' };
          break;
        case 'featured':
          orderBy = { displayOrder: 'asc' };
          break;
        case 'trending':
          orderBy = { createdAt: 'desc' };
          break;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.template.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          tags: true,
          seoMetadata: true,
        },
      }),
      this.prisma.template.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(idOrSlug: string) {
    const template = await this.prisma.template.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        tags: true,
        seoMetadata: true,
        watermark: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Capture dynamic stats increment
    await this.prisma.activityLog.create({
      data: {
        action: 'VIEW_TEMPLATE',
        details: `Template viewed: ${template.title} (${template.id})`,
      },
    }).catch(() => {}); // Prevent crash if logging fails

    return template;
  }

  async update(id: string, dto: CreateTemplateDto) {
    const template = await this.prisma.template.findUnique({ where: { id }, include: { tags: true } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const slug = dto.slug ? this.slugify(dto.slug) : template.slug;

    if (slug !== template.slug) {
      const existing = await this.prisma.template.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`Template with slug '${slug}' already exists`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Disconnect all previous tags and connect new ones if provided
      const updateData: Prisma.TemplateUpdateInput = {
        title: dto.title,
        slug,
        description: dto.description,
        price: dto.price !== undefined ? new Prisma.Decimal(dto.price) : undefined,
        previewVideoUrl: dto.previewVideoUrl ?? null,
        imageUrls: dto.imageUrls,
        watermarked: dto.watermarked,
        watermark: dto.watermarkId ? { connect: { id: dto.watermarkId } } : { disconnect: true },
        category: { connect: { id: dto.categoryId } },
        displayOrder: dto.displayOrder,
      };

      if (dto.tagIds) {
        updateData.tags = {
          set: dto.tagIds.map((tid) => ({ id: tid })),
        };
      }

      await tx.template.update({
        where: { id },
        data: updateData,
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.upsert({
          where: { templateId: id },
          update: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
          },
          create: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            templateId: id,
          },
        });
      }

      return tx.template.findUnique({
        where: { id },
        include: { tags: true, category: true, seoMetadata: true },
      });
    });
  }

  async remove(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.template.delete({ where: { id } });
  }

  async getRelated(id: string, limit = 4) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.template.findMany({
      where: {
        categoryId: template.categoryId,
        id: { not: template.id },
      },
      take: limit,
      orderBy: { displayOrder: 'asc' },
    });
  }
}
