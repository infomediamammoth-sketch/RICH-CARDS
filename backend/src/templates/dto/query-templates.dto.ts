import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTemplatesDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string; // "newest" | "popular" | "featured" | "trending"

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
