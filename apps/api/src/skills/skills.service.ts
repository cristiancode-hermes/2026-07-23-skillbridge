import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { SkillCategory } from './skill-category.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(SkillCategory)
    private readonly categoryRepository: Repository<SkillCategory>,
  ) {}

  async findAll(category?: string, search?: string, sort?: string, page?: number) {
    const query = this.skillRepository.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.category', 'category')
      .leftJoinAndSelect('skill.userSkills', 'userSkills');

    if (category) {
      query.andWhere('category.slug = :category', { category });
    }

    if (search) {
      query.andWhere('(skill.name LIKE :search OR skill.description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sort === 'name') {
      query.orderBy('skill.name', 'ASC');
    } else {
      query.orderBy('skill.createdAt', 'DESC');
    }

    if (page && page > 0) {
      const perPage = 20;
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [skills, total] = await query.getManyAndCount();

    const skillsWithCounts = skills.map(skill => ({
      ...skill,
      teacherCount: skill.userSkills?.filter(us => us.type === 'offering').length || 0,
      userSkills: undefined,
    }));

    return { skills: skillsWithCounts, total };
  }

  async findCategories() {
    return this.categoryRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async search(query: string) {
    if (!query || query.length < 2) {
      return { skills: [], users: [] };
    }

    const skills = await this.skillRepository.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.category', 'category')
      .where('skill.name LIKE :query', { query: `%${query}%` })
      .take(20)
      .getMany();

    return { skills };
  }

  async findOne(id: string) {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: { category: true, userSkills: { user: true } },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const teacherCount = skill.userSkills?.filter(us => us.type === 'offering').length || 0;
    const { userSkills, ...skillData } = skill;

    return { ...skillData, teacherCount };
  }
}
