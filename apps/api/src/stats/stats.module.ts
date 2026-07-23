import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { Review } from '../reviews/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Skill, Exchange, Review])],
  controllers: [StatsController],
})
export class StatsModule {}
