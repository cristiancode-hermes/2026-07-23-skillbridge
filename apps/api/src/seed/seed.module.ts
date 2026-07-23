import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User } from '../users/user.entity';
import { SkillCategory } from '../skills/skill-category.entity';
import { Skill } from '../skills/skill.entity';
import { UserSkill } from '../user-skills/user-skill.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { Session } from '../sessions/session.entity';
import { Message } from '../messages/message.entity';
import { Review } from '../reviews/review.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, SkillCategory, Skill, UserSkill, Exchange, Session, Message, Review]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
