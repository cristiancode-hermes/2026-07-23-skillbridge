import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserSkillsService } from './user-skills.service';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UserSkillsController {
  constructor(private readonly userSkillsService: UserSkillsService) {}

  @Get('me/skills')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMySkills(@CurrentUser('id') id: string) {
    return this.userSkillsService.getMySkills(id);
  }

  @Post('me/skills')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addSkill(@CurrentUser('id') id: string, @Body() dto: CreateUserSkillDto) {
    return this.userSkillsService.addSkill(id, dto);
  }

  @Delete('me/skills/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeSkill(@Param('id') id: string) {
    return this.userSkillsService.removeSkill(id);
  }

  @Get(':id/skills')
  async getUserSkills(@Param('id') id: string) {
    return this.userSkillsService.getUserSkills(id);
  }
}
