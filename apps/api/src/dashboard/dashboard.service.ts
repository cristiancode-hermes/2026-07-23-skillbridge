import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { UserSkill } from '../user-skills/user-skill.entity';
import { Review } from '../reviews/review.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getStats(userId: string) {
    const offeringsCount = await this.userSkillRepository.count({
      where: { userId, type: 'offering' },
    });
    const seekingsCount = await this.userSkillRepository.count({
      where: { userId, type: 'seeking' },
    });

    const exchangesSent = await this.exchangeRepository.count({
      where: { senderId: userId },
    });
    const exchangesReceived = await this.exchangeRepository.count({
      where: { receiverId: userId },
    });

    const activeExchanges = await this.exchangeRepository.count({
      where: [
        { senderId: userId, status: 'active' },
        { receiverId: userId, status: 'active' },
      ],
    });

    const completedExchanges = await this.exchangeRepository.count({
      where: [
        { senderId: userId, status: 'completed' },
        { receiverId: userId, status: 'completed' },
      ],
    });

    const reviews = await this.reviewRepository.count({
      where: { targetId: userId },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      skills: { offerings: offeringsCount, seekings: seekingsCount },
      exchanges: { sent: exchangesSent, received: exchangesReceived, active: activeExchanges, completed: completedExchanges },
      rating: { avg: user?.ratingAvg || 0, count: user?.ratingCount || 0 },
      reviews,
    };
  }

  async getExchanges(userId: string, status?: string) {
    const where: any[] = [
      { senderId: userId },
      { receiverId: userId },
    ];

    const query = await this.exchangeRepository.find({
      where: status ? where.map((w) => ({ ...w, status })) : where,
      relations: { skill: true, sender: true, receiver: true },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return query;
  }
}
