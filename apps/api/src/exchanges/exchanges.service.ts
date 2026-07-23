import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exchange } from './exchange.entity';
import { CreateExchangeDto } from './dto/create-exchange.dto';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
  ) {}

  async findAll(userId: string, status?: string, page?: number) {
    const query = this.exchangeRepository.createQueryBuilder('exchange')
      .leftJoinAndSelect('exchange.skill', 'skill')
      .leftJoinAndSelect('exchange.sender', 'sender')
      .leftJoinAndSelect('exchange.receiver', 'receiver')
      .where('(exchange.senderId = :userId OR exchange.receiverId = :userId)', { userId });

    if (status) {
      query.andWhere('exchange.status = :status', { status });
    }

    query.orderBy('exchange.createdAt', 'DESC');

    if (page && page > 0) {
      const perPage = 20;
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [exchanges, total] = await query.getManyAndCount();
    return { exchanges, total };
  }

  async create(userId: string, dto: CreateExchangeDto) {
    if (userId === dto.receiverId) {
      throw new BadRequestException('Cannot create exchange with yourself');
    }

    const exchange = this.exchangeRepository.create({
      skillId: dto.skillId,
      senderId: userId,
      receiverId: dto.receiverId,
      message: dto.message || '',
      status: 'pending',
    });

    const saved = await this.exchangeRepository.save(exchange) as unknown as Exchange;
    return this.findOne(saved.id);
  }

  async findOne(id: string) {
    const exchange = await this.exchangeRepository.findOne({
      where: { id },
      relations: {
        skill: { category: true },
        sender: true,
        receiver: true,
        sessions: true,
        review: true,
      },
    });

    if (!exchange) {
      throw new NotFoundException('Exchange not found');
    }

    return exchange;
  }

  async accept(id: string, userId: string) {
    const exchange = await this.findOne(id);

    if (exchange.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can accept this exchange');
    }
    if (exchange.status !== 'pending') {
      throw new BadRequestException(`Cannot accept exchange in status: ${exchange.status}`);
    }

    exchange.status = 'active';
    return this.exchangeRepository.save(exchange) as unknown as Exchange;
  }

  async decline(id: string, userId: string, reason?: string) {
    const exchange = await this.findOne(id);

    if (exchange.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can decline this exchange');
    }
    if (exchange.status !== 'pending') {
      throw new BadRequestException(`Cannot decline exchange in status: ${exchange.status}`);
    }

    exchange.status = 'declined';
    exchange.reason = reason ?? undefined;
    return this.exchangeRepository.save(exchange) as unknown as Exchange;
  }

  async cancel(id: string, userId: string) {
    const exchange = await this.findOne(id);

    if (exchange.senderId !== userId && exchange.receiverId !== userId) {
      throw new ForbiddenException('You are not part of this exchange');
    }
    if (!['pending', 'active'].includes(exchange.status)) {
      throw new BadRequestException(`Cannot cancel exchange in status: ${exchange.status}`);
    }

    exchange.status = 'cancelled';
    return this.exchangeRepository.save(exchange) as unknown as Exchange;
  }

  async complete(id: string, userId: string) {
    const exchange = await this.findOne(id);

    if (exchange.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can mark this exchange as complete');
    }
    if (exchange.status !== 'active') {
      throw new BadRequestException(`Cannot complete exchange in status: ${exchange.status}`);
    }

    exchange.status = 'completed';
    return this.exchangeRepository.save(exchange) as unknown as Exchange;
  }
}
