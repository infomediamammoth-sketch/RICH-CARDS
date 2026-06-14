import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email || null,
        templateId: dto.templateId || null,
        source: dto.source || 'WhatsApp',
        notes: dto.notes || null,
        status: 'New',
      },
      include: {
        template: true,
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
      },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { template: true },
    });
    if (!lead) {
      throw new NotFoundException(`Lead not found`);
    }
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead not found`);
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        template: true,
      },
    });
  }

  async remove(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead not found`);
    }

    return this.prisma.lead.delete({ where: { id } });
  }
}
