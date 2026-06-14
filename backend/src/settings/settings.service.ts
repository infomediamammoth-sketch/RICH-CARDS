import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setting.findMany();
  }

  async findOne(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }
    return setting;
  }

  async update(key: string, value: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }

    return this.prisma.setting.update({
      where: { key },
      data: { value },
    });
  }

  async updateMany(settings: Record<string, string>) {
    return this.prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, description: 'User defined configuration' },
        }),
      ),
    );
  }
}
