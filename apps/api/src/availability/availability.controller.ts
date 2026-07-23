import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

class UpdateAvailabilityDto {
  slots: { dayOfWeek: number; startTime: string; endTime: string }[];
}

@ApiTags('availability')
@Controller('users')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyAvailability(@CurrentUser() user: User) {
    return this.availabilityService.findByUser(user.id);
  }

  @Put('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateAvailability(@CurrentUser() user: User, @Body() dto: UpdateAvailabilityDto) {
    return this.availabilityService.update(user.id, dto.slots);
  }

  @Get(':id/availability')
  async getUserAvailability(@Param('id') id: string) {
    return this.availabilityService.findByUser(id);
  }
}
