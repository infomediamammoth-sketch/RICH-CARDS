import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WatermarksService } from './watermarks.service';
import { CreateWatermarkDto } from './dto/create-watermark.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('watermarks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin', 'Admin')
export class WatermarksController {
  constructor(private readonly watermarksService: WatermarksService) {}

  @Roles('Super Admin', 'Admin', 'Staff')
  @Get()
  async findAll() {
    return this.watermarksService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateWatermarkDto) {
    return this.watermarksService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateWatermarkDto) {
    return this.watermarksService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.watermarksService.remove(id);
  }
}
