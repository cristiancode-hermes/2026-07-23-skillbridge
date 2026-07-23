import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilitySlot } from './availability-slot.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilitySlot)
    private readonly slotRepository: Repository<AvailabilitySlot>,
  ) {}

  async findByUser(userId: string) {
    return this.slotRepository.find({
      where: { userId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async update(userId: string, slots: { dayOfWeek: number; startTime: string; endTime: string }[]) {
    await this.slotRepository.delete({ userId });
    const entities = slots.map((slot) =>
      this.slotRepository.create({
        userId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }),
    );
    return this.slotRepository.save(entities) as unknown as AvailabilitySlot[];
  }
}
