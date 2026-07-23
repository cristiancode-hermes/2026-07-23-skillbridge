import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('availability_slots')
@Unique(['userId', 'dayOfWeek', 'startTime'])
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'int', name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ type: 'varchar', length: 10, name: 'start_time' })
  startTime: string;

  @Column({ type: 'varchar', length: 10, name: 'end_time' })
  endTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.availability)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
