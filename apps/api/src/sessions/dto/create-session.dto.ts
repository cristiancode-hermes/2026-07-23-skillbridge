import { IsString, IsDateString, IsNumber, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsNumber()
  @IsIn([30, 60, 90])
  duration: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;
}
