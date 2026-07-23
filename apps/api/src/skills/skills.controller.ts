import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { QuerySkillsDto } from './dto/query-skills.dto';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getAll(@Query() query: QuerySkillsDto) {
    return this.skillsService.findAll(query.category, query.search, query.sort, query.page);
  }

  @Get('categories')
  async getCategories() {
    return this.skillsService.findCategories();
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.skillsService.search(q);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }
}
