import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Skill } from './skill.entity';

@Entity('skill_categories')
export class SkillCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 10 })
  emoji: string;

  @Column({ type: 'uuid', nullable: true, name: 'parent_id' })
  parentId?: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => SkillCategory, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: SkillCategory;

  @OneToMany(() => Skill, (skill) => skill.category)
  skills: Skill[];
}
