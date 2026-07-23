import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserSkill } from '../user-skills/user-skill.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { Review } from '../reviews/review.entity';
import { Message } from '../messages/message.entity';
import { AvailabilitySlot } from '../availability/availability-slot.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'text', nullable: true, name: 'bio' })
  bio?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'photo_url' })
  photoUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'location' })
  location?: string;

  @Column({ type: 'float', default: 0, name: 'rating_avg' })
  ratingAvg: number;

  @Column({ type: 'int', default: 0, name: 'rating_count' })
  ratingCount: number;

  @Column({ type: 'boolean', default: false, name: 'onboarded' })
  onboarded: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  skills: UserSkill[];

  @OneToMany(() => Exchange, (exchange) => exchange.sender)
  sentExchanges: Exchange[];

  @OneToMany(() => Exchange, (exchange) => exchange.receiver)
  receivedExchanges: Exchange[];

  @OneToMany(() => Review, (review) => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Review, (review) => review.target)
  receivedReviews: Review[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.user)
  availability: AvailabilitySlot[];
}
