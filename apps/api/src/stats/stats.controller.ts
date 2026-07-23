import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { Review } from '../reviews/review.entity';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  @Get('public')
  async getPublicStats() {
    const members = await this.userRepository.count();
    const skills = await this.skillRepository.count();
    const exchanges = await this.exchangeRepository.count();
    const reviews = await this.reviewRepository.find();

    const satisfaction = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    return { members, skills, exchanges, satisfaction };
  }
}
