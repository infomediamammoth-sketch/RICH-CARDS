import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  featuredImg?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readingTime?: number = 1;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];

  // SEO fields
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];
}
