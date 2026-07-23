import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { UserSkillsModule } from './user-skills/user-skills.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { SessionsModule } from './sessions/sessions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';
import { AvailabilityModule } from './availability/availability.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StatsModule } from './stats/stats.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('DATABASE_PATH', 'data/skillbridge.sqlite'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    SkillsModule,
    UserSkillsModule,
    ExchangesModule,
    SessionsModule,
    ReviewsModule,
    MessagesModule,
    AvailabilityModule,
    DashboardModule,
    StatsModule,
    SeedModule,
  ],
})
export class AppModule {}
