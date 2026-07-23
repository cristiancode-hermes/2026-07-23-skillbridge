import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExchangesService } from './exchanges.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { StatusActionDto } from './dto/status-action.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('exchanges')
@Controller('exchanges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
  ) {
    return this.exchangesService.findAll(userId, status, page ? +page : undefined);
  }

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateExchangeDto) {
    return this.exchangesService.create(userId, dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.exchangesService.findOne(id);
  }

  @Patch(':id/accept')
  async accept(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.exchangesService.accept(id, userId);
  }

  @Patch(':id/decline')
  async decline(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: StatusActionDto,
  ) {
    return this.exchangesService.decline(id, userId, dto.reason);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.exchangesService.cancel(id, userId);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.exchangesService.complete(id, userId);
  }
}
