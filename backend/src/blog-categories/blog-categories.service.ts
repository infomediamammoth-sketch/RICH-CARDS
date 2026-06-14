import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';

@Injectable()
export class BlogCategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(dto: CreateBlogCategoryDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    const existing = await this.prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Blog category with slug '${slug}' already exists`);
    }

    return this.prisma.blogCategory.create({
      data: {
        name: dto.name,
        slug,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.blogCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.blogCategory.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        blogs: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Blog category not found`);
    }

    return category;
  }

  async update(id: string, dto: CreateBlogCategoryDto) {
    const category = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Blog category not found`);
    }

    const slug = dto.slug ? this.slugify(dto.slug) : category.slug;

    if (slug !== category.slug) {
      const existing = await this.prisma.blogCategory.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`Blog category with slug '${slug}' already exists`);
      }
    }

    return this.prisma.blogCategory.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Blog category not found`);
    }

    return this.prisma.blogCategory.delete({ where: { id } });
  }
}
