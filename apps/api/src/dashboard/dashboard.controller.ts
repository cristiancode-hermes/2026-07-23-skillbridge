import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@CurrentUser() user: User) {
    return this.dashboardService.getStats(user.id);
  }

  @Get('exchanges')
  @ApiQuery({ name: 'status', required: false })
  async getExchanges(@CurrentUser() user: User, @Query('status') status?: string) {
    return this.dashboardService.getExchanges(user.id, status);
  }
}
