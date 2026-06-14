import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(authorId: string, dto: CreateBlogDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.title);

    const existing = await this.prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Blog post with slug '${slug}' already exists`);
    }

    return this.prisma.$transaction(async (tx) => {
      const blog = await tx.blog.create({
        data: {
          title: dto.title,
          slug,
          content: dto.content,
          featuredImg: dto.featuredImg || null,
          readingTime: dto.readingTime ?? 1,
          authorId,
          categoryId: dto.categoryId,
          tags: dto.tagIds ? {
            connect: dto.tagIds.map((id) => ({ id })),
          } : undefined,
        },
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.create({
          data: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            blogId: blog.id,
          },
        });
      }

      return tx.blog.findUnique({
        where: { id: blog.id },
        include: { author: true, category: true, tags: true, seoMetadata: true },
      });
    });
  }

  async findAll(categoryId?: string) {
    return this.prisma.blog.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
        seoMetadata: true,
      },
    });
  }

  async findOne(idOrSlug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
        seoMetadata: true,
      },
    });

    if (!blog) {
      throw new NotFoundException(`Blog post not found`);
    }

    return blog;
  }

  async update(id: string, dto: CreateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog post not found`);
    }

    const slug = dto.slug ? this.slugify(dto.slug) : blog.slug;

    if (slug !== blog.slug) {
      const existing = await this.prisma.blog.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`Blog post with slug '${slug}' already exists`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updateData: any = {
        title: dto.title,
        slug,
        content: dto.content,
        featuredImg: dto.featuredImg || null,
        readingTime: dto.readingTime ?? 1,
        categoryId: dto.categoryId,
      };

      if (dto.tagIds) {
        updateData.tags = {
          set: dto.tagIds.map((tid) => ({ id: tid })),
        };
      }

      await tx.blog.update({
        where: { id },
        data: updateData,
      });

      if (dto.seoTitle || dto.seoDescription || dto.seoKeywords) {
        await tx.seoMetadata.upsert({
          where: { blogId: id },
          update: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
          },
          create: {
            title: dto.seoTitle || null,
            description: dto.seoDescription || null,
            keywords: dto.seoKeywords || [],
            blogId: id,
          },
        });
      }

      return tx.blog.findUnique({
        where: { id },
        include: { author: true, category: true, tags: true, seoMetadata: true },
      });
    });
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog post not found`);
    }

    return this.prisma.blog.delete({ where: { id } });
  }
}
