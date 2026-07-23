import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async getByExchange(exchangeId: string) {
    return this.sessionRepository.find({
      where: { exchangeId },
      relations: { proposedBy: true },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async create(exchangeId: string, userId: string, dto: CreateSessionDto) {
    const session = this.sessionRepository.create({
      exchangeId,
      proposedById: userId,
      date: dto.date,
      startTime: dto.startTime,
      durationMinutes: dto.duration,
      location: dto.location ?? undefined,
      status: 'pending',
    });
    return this.sessionRepository.save(session) as unknown as Session;
  }

  async confirm(id: string, userId: string) {
    const session = await this.findById(id);
    if (session.status !== 'pending') {
      throw new BadRequestException(`Cannot confirm session in status: ${session.status}`);
    }
    session.status = 'confirmed';
    return this.sessionRepository.save(session) as unknown as Session;
  }

  async update(id: string, dto: UpdateSessionDto) {
    const session = await this.findById(id);
    if (dto.date !== undefined) session.date = dto.date;
    if (dto.startTime !== undefined) session.startTime = dto.startTime;
    if (dto.duration !== undefined) session.durationMinutes = dto.duration;
    if (dto.location !== undefined) session.location = dto.location;
    return this.sessionRepository.save(session) as unknown as Session;
  }

  async complete(id: string) {
    const session = await this.findById(id);
    if (session.status !== 'confirmed') {
      throw new BadRequestException(`Cannot complete session in status: ${session.status}`);
    }
    session.status = 'completed';
    return this.sessionRepository.save(session) as unknown as Session;
  }

  async remove(id: string) {
    const session = await this.findById(id);
    await this.sessionRepository.remove(session);
    return { message: 'Session deleted successfully' };
  }

  private async findById(id: string) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: { exchange: true, proposedBy: true },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }
}
