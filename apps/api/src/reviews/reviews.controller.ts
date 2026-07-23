import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('reviews')
@Controller('api')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('users/:id/reviews')
  async getByUser(@Param('id') id: string) {
    return this.reviewsService.getByUser(id);
  }

  @Post('exchanges/:exchangeId/review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Param('exchangeId') exchangeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(exchangeId, userId, dto);
  }
}
