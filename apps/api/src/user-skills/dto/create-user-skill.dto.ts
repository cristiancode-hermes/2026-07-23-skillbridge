import { IsUUID, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSkillDto {
  @ApiProperty()
  @IsUUID()
  skillId: string;

  @ApiProperty({ enum: ['offering', 'seeking'] })
  @IsString()
  @IsIn(['offering', 'seeking'])
  type: 'offering' | 'seeking';
}
