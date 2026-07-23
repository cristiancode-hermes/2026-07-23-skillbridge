import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany, OneToOne
} from 'typeorm';
import { Skill } from '../skills/skill.entity';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { Message } from '../messages/message.entity';
import { Review } from '../reviews/review.entity';

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'skill_id' })
  skillId: string;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  @Column({ type: 'uuid', name: 'receiver_id' })
  receiverId: string;

  @Column({ type: 'text', nullable: true, name: 'message' })
  message?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'declined';

  @Column({ type: 'text', nullable: true, name: 'reason' })
  reason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Skill, (skill) => skill.userSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => User, (user) => user.sentExchanges)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedExchanges)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @OneToMany(() => Session, (session) => session.exchange)
  sessions: Session[];

  @OneToMany(() => Message, (message) => message.exchange)
  messages: Message[];

  @OneToOne(() => Review, (review) => review.exchange)
  review: Review;
}
