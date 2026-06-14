import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  async create(@Body() dto: CreateTestimonialDto) {
    // Public creation has isApproved = false forced
    dto.isApproved = false;
    return this.testimonialsService.create(dto);
  }

  @Get()
  async findAllApproved() {
    return this.testimonialsService.findAll(true);
  }

  @Get('featured')
  async findFeatured() {
    return this.testimonialsService.findFeatured();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Admin', 'Staff')
  @Get('admin')
  async findAllAdmin() {
    return this.testimonialsService.findAll(false);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Admin', 'Staff')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Admin', 'Staff')
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.testimonialsService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
