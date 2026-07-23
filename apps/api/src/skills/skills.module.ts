import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { CategoriesController } from './categories.controller';
import { SkillsService } from './skills.service';
import { Skill } from './skill.entity';
import { SkillCategory } from './skill-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, SkillCategory])],
  controllers: [SkillsController, CategoriesController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
