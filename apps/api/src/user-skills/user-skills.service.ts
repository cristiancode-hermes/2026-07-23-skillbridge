import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill } from './user-skill.entity';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';

@Injectable()
export class UserSkillsService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
  ) {}

  async getMySkills(userId: string) {
    return this.userSkillRepository.find({
      where: { userId },
      relations: { skill: { category: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async addSkill(userId: string, dto: CreateUserSkillDto) {
    const existing = await this.userSkillRepository.findOne({
      where: { userId, skillId: dto.skillId, type: dto.type },
    });
    if (existing) {
      throw new ConflictException('Skill already added');
    }

    const userSkill = this.userSkillRepository.create({
      userId,
      skillId: dto.skillId,
      type: dto.type,
    });
    return this.userSkillRepository.save(userSkill) as unknown as UserSkill;
  }

  async removeSkill(id: string) {
    const userSkill = await this.userSkillRepository.findOne({ where: { id } });
    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }
    await this.userSkillRepository.remove(userSkill);
    return { message: 'Skill removed successfully' };
  }

  async getUserSkills(userId: string) {
    return this.userSkillRepository.find({
      where: { userId },
      relations: { skill: { category: true } },
      order: { createdAt: 'DESC' },
    });
  }
}
