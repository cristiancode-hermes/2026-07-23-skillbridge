import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, OneToOne, Unique
} from 'typeorm';
import { Exchange } from '../exchanges/exchange.entity';
import { User } from '../users/user.entity';

@Entity('reviews')
@Unique(['exchangeId', 'reviewerId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, name: 'exchange_id' })
  exchangeId: string;

  @Column({ type: 'uuid', name: 'reviewer_id' })
  reviewerId: string;

  @Column({ type: 'uuid', name: 'target_id' })
  targetId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'text' })
  text?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Exchange, (exchange) => exchange.review)
  @JoinColumn({ name: 'exchange_id' })
  exchange: Exchange;

  @ManyToOne(() => User, (user) => user.givenReviews)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  @JoinColumn({ name: 'target_id' })
  target: User;
}
