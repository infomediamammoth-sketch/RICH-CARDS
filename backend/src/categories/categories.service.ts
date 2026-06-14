import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    
    // Check if slug is unique
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    // Create Category with transaction for SEO metadata
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          name: dto.name,
          slug,
          parentCategoryId: dto.parentCategoryId || null,
          displayOrder: dto.displayOrder ?? 0,
          icon: dto.icon || null,
          bannerImage: dto.bannerImage || null,
        },
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.create({
          data: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            categoryId: category.id,
          },
        });
      }

      return tx.category.findUnique({
        where: { id: category.id },
        include: { seoMetadata: true },
      });
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        seoMetadata: true,
        parentCategory: true,
        subCategories: true,
        _count: {
          select: { templates: true },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        seoMetadata: true,
        parentCategory: true,
        subCategories: true,
        templates: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    return category;
  }

  async update(id: string, dto: CreateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const slug = dto.slug ? this.slugify(dto.slug) : category.slug;

    if (slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: {
          name: dto.name,
          slug,
          parentCategoryId: dto.parentCategoryId || null,
          displayOrder: dto.displayOrder ?? 0,
          icon: dto.icon || null,
          bannerImage: dto.bannerImage || null,
        },
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.upsert({
          where: { categoryId: id },
          update: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
          },
          create: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            categoryId: id,
          },
        });
      }

      return tx.category.findUnique({
        where: { id },
        include: { seoMetadata: true },
      });
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    // Delete category. Cascade deletes associated SEO metadata (if configured in schema, or we can handle it here)
    return this.prisma.category.delete({ where: { id } });
  }
}
