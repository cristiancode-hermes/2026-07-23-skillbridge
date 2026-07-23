import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';

@Entity('user_skills')
@Unique(['userId', 'skillId', 'type'])
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'skill_id' })
  skillId: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'offering' | 'seeking';

  @Column({ type: 'int', default: 0, name: 'session_count' })
  sessionCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.skills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
