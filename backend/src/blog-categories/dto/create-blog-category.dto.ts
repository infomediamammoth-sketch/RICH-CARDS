import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
