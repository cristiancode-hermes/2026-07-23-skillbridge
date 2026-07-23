import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/user.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { UserSkill } from '../user-skills/user-skill.entity';
import { Review } from '../reviews/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Exchange, UserSkill, Review])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
