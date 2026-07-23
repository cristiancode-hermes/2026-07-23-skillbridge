import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByUser(targetId: string) {
    return this.reviewRepository.find({
      where: { targetId },
      relations: { reviewer: true, exchange: { skill: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(exchangeId: string, userId: string, dto: CreateReviewDto) {
    const existing = await this.reviewRepository.findOne({
      where: { exchangeId, reviewerId: userId },
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this exchange');
    }

    const exchange = await this.reviewRepository.manager
      .getRepository('Exchange')
      .findOne({ where: { id: exchangeId } });

    if (!exchange) {
      throw new NotFoundException('Exchange not found');
    }

    const targetId = exchange.receiverId === userId
      ? exchange.senderId
      : exchange.receiverId;

    if (targetId === userId) {
      throw new BadRequestException('Cannot review yourself');
    }

    const review = this.reviewRepository.create({
      exchangeId,
      reviewerId: userId,
      targetId,
      rating: dto.rating,
      text: dto.text ?? undefined,
    });

    const saved = await this.reviewRepository.save(review) as unknown as Review;

    // Update target user's average rating
    const reviews = await this.reviewRepository.find({ where: { targetId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.userRepository.update(targetId, {
      ratingAvg: Math.round(avgRating * 10) / 10,
      ratingCount: reviews.length,
    });

    return saved;
  }
}
