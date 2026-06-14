import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MediaModule } from './media/media.module';
import { TemplatesModule } from './templates/templates.module';
import { LeadsModule } from './leads/leads.module';
import { BlogsModule } from './blogs/blogs.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { BannersModule } from './banners/banners.module';
import { WatermarksModule } from './watermarks/watermarks.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    TagsModule,
    MediaModule,
    TemplatesModule,
    LeadsModule,
    BlogsModule,
    BlogCategoriesModule,
    TestimonialsModule,
    BannersModule,
    WatermarksModule,
    SettingsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
