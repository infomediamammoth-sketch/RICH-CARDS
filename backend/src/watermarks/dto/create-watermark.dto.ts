import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWatermarkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  filepath: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  opacity?: number = 0.5;

  @IsString()
  @IsOptional()
  position?: string = 'center';

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isGlobal?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean = true;
}
