import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Exchange } from '../exchanges/exchange.entity';
import { User } from '../users/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'exchange_id' })
  exchangeId: string;

  @Column({ type: 'uuid', name: 'proposed_by_id' })
  proposedById: string;

  @Column({ type: 'date', name: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 10, name: 'start_time' })
  startTime: string;

  @Column({ type: 'int', default: 60, name: 'duration_minutes' })
  durationMinutes: number;

  @Column({ type: 'text', nullable: true, name: 'location' })
  location?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Exchange, (exchange) => exchange.sessions)
  @JoinColumn({ name: 'exchange_id' })
  exchange: Exchange;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'proposed_by_id' })
  proposedBy: User;
}
