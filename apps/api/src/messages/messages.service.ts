import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getByExchange(exchangeId: string) {
    return this.messageRepository.find({
      where: { exchangeId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
    });
  }

  async create(exchangeId: string, userId: string, text: string) {
    const message = this.messageRepository.create({
      exchangeId,
      senderId: userId,
      text,
    });
    return this.messageRepository.save(message) as unknown as Message;
  }
}
