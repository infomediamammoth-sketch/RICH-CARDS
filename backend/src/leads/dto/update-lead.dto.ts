import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  @IsIn(['New', 'Contacted', 'Interested', 'Closed', 'Rejected'], {
    message: 'Status must be one of: New, Contacted, Interested, Closed, Rejected',
  })
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
