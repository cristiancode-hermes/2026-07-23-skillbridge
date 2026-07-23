import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StatusActionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}
