import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(dto: CreateTagDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    const existing = await this.prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Tag with slug '${slug}' already exists`);
    }

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            templates: true,
            blogs: true,
          },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const tag = await this.prisma.tag.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        templates: true,
        blogs: true,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag not found`);
    }

    return tag;
  }

  async update(id: string, dto: CreateTagDto) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag not found`);
    }

    const slug = dto.slug ? this.slugify(dto.slug) : tag.slug;

    if (slug !== tag.slug) {
      const existing = await this.prisma.tag.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`Tag with slug '${slug}' already exists`);
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag not found`);
    }

    return this.prisma.tag.delete({ where: { id } });
  }
}
