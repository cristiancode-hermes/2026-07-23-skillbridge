import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExchangeDto {
  @ApiProperty()
  @IsUUID()
  skillId: string;

  @ApiProperty()
  @IsUUID()
  receiverId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  message?: string;
}
