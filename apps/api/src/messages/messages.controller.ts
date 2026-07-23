import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('messages')
@Controller('api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('exchanges/:exchangeId/messages')
  async getByExchange(@Param('exchangeId') exchangeId: string) {
    return this.messagesService.getByExchange(exchangeId);
  }

  @Post('exchanges/:exchangeId/messages')
  async create(
    @Param('exchangeId') exchangeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(exchangeId, userId, dto.text);
  }
}
