import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('sessions')
@Controller('api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('exchanges/:exchangeId/sessions')
  async getByExchange(@Param('exchangeId') exchangeId: string) {
    return this.sessionsService.getByExchange(exchangeId);
  }

  @Post('exchanges/:exchangeId/sessions')
  async create(
    @Param('exchangeId') exchangeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionsService.create(exchangeId, userId, dto);
  }

  @Patch('sessions/:id/confirm')
  async confirm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.sessionsService.confirm(id, userId);
  }

  @Patch('sessions/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @Patch('sessions/:id/complete')
  async complete(@Param('id') id: string) {
    return this.sessionsService.complete(id);
  }

  @Delete('sessions/:id')
  async remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}
