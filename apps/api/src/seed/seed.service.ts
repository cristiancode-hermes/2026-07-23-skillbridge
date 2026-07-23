import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { SkillCategory } from '../skills/skill-category.entity';
import { Skill } from '../skills/skill.entity';
import { UserSkill } from '../user-skills/user-skill.entity';
import { Exchange } from '../exchanges/exchange.entity';
import { Session } from '../sessions/session.entity';
import { Message } from '../messages/message.entity';
import { Review } from '../reviews/review.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SkillCategory)
    private readonly categoryRepository: Repository<SkillCategory>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<string>('SEED_DB');
    if (shouldSeed !== 'true') return;

    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding database...');
    await this.seed();
    this.logger.log('Database seeded successfully!');
  }

  private async seed() {
    // Create categories
    const categories = await this.categoryRepository.save([
      { name: 'Technology', slug: 'technology', emoji: '💻', sortOrder: 1 },
      { name: 'Arts', slug: 'arts', emoji: '🎨', sortOrder: 2 },
      { name: 'Wellness', slug: 'wellness', emoji: '🧘', sortOrder: 3 },
      { name: 'Languages', slug: 'languages', emoji: '🌐', sortOrder: 4 },
      { name: 'Music', slug: 'music', emoji: '🎵', sortOrder: 5 },
      { name: 'Sports', slug: 'sports', emoji: '⚽', sortOrder: 6 },
      { name: 'Cooking', slug: 'cooking', emoji: '🍳', sortOrder: 7 },
      { name: 'Business', slug: 'business', emoji: '💼', sortOrder: 8 },
      { name: 'Academic', slug: 'academic', emoji: '📚', sortOrder: 9 },
      { name: 'Other', slug: 'other', emoji: '🔧', sortOrder: 10 },
    ] as SkillCategory[]);

    // Create skills
    const techSkills = await this.skillRepository.save([
      { name: 'Python', emoji: '🐍', categoryId: categories[0].id, description: 'Python programming language' },
      { name: 'JavaScript', emoji: '💻', categoryId: categories[0].id, description: 'JavaScript programming language' },
      { name: 'TypeScript', emoji: '📘', categoryId: categories[0].id, description: 'TypeScript programming language' },
      { name: 'React', emoji: '⚛️', categoryId: categories[0].id, description: 'React frontend framework' },
      { name: 'Angular', emoji: '🅰️', categoryId: categories[0].id, description: 'Angular frontend framework' },
      { name: 'Node.js', emoji: '🟢', categoryId: categories[0].id, description: 'Node.js runtime' },
      { name: 'SQL', emoji: '🗄️', categoryId: categories[0].id, description: 'SQL databases' },
      { name: 'Docker', emoji: '🐳', categoryId: categories[0].id, description: 'Containerization' },
      { name: 'Git', emoji: '🔀', categoryId: categories[0].id, description: 'Version control' },
      { name: 'Linux', emoji: '🐧', categoryId: categories[0].id, description: 'Linux administration' },
    ] as Skill[]);

    const artSkills = await this.skillRepository.save([
      { name: 'Photography', emoji: '📷', categoryId: categories[1].id, description: 'Digital photography' },
      { name: 'Drawing', emoji: '✏️', categoryId: categories[1].id, description: 'Traditional drawing' },
      { name: 'Painting', emoji: '🖌️', categoryId: categories[1].id, description: 'Painting techniques' },
      { name: 'Digital Art', emoji: '🖥️', categoryId: categories[1].id, description: 'Digital illustration' },
      { name: 'UI Design', emoji: '🎯', categoryId: categories[1].id, description: 'User interface design' },
    ] as Skill[]);

    const wellnessSkills = await this.skillRepository.save([
      { name: 'Yoga', emoji: '🧘‍♀️', categoryId: categories[2].id, description: 'Yoga practice' },
      { name: 'Meditation', emoji: '🧠', categoryId: categories[2].id, description: 'Meditation techniques' },
      { name: 'Nutrition', emoji: '🥗', categoryId: categories[2].id, description: 'Healthy eating' },
      { name: 'Fitness', emoji: '💪', categoryId: categories[2].id, description: 'Physical fitness' },
    ] as Skill[]);

    const languageSkills = await this.skillRepository.save([
      { name: 'Spanish', emoji: '🇪🇸', categoryId: categories[3].id, description: 'Spanish language' },
      { name: 'English', emoji: '🇬🇧', categoryId: categories[3].id, description: 'English language' },
      { name: 'French', emoji: '🇫🇷', categoryId: categories[3].id, description: 'French language' },
      { name: 'German', emoji: '🇩🇪', categoryId: categories[3].id, description: 'German language' },
      { name: 'Japanese', emoji: '🇯🇵', categoryId: categories[3].id, description: 'Japanese language' },
      { name: 'Mandarin', emoji: '🇨🇳', categoryId: categories[3].id, description: 'Mandarin Chinese' },
    ] as Skill[]);

    const musicSkills = await this.skillRepository.save([
      { name: 'Guitar', emoji: '🎸', categoryId: categories[4].id, description: 'Guitar playing' },
      { name: 'Piano', emoji: '🎹', categoryId: categories[4].id, description: 'Piano playing' },
      { name: 'Drums', emoji: '🥁', categoryId: categories[4].id, description: 'Drumming' },
      { name: 'Singing', emoji: '🎤', categoryId: categories[4].id, description: 'Vocal training' },
      { name: 'Music Production', emoji: '🎧', categoryId: categories[4].id, description: 'Music production' },
    ] as Skill[]);

    const sportSkills = await this.skillRepository.save([
      { name: 'Football', emoji: '⚽', categoryId: categories[5].id, description: 'Football/soccer' },
      { name: 'Basketball', emoji: '🏀', categoryId: categories[5].id, description: 'Basketball' },
      { name: 'Tennis', emoji: '🎾', categoryId: categories[5].id, description: 'Tennis' },
      { name: 'Swimming', emoji: '🏊', categoryId: categories[5].id, description: 'Swimming' },
      { name: 'Running', emoji: '🏃', categoryId: categories[5].id, description: 'Running' },
    ] as Skill[]);

    const cookingSkills = await this.skillRepository.save([
      { name: 'Cooking', emoji: '🥘', categoryId: categories[6].id, description: 'General cooking' },
      { name: 'Baking', emoji: '🥖', categoryId: categories[6].id, description: 'Baking bread and pastries' },
      { name: 'Vegan Cooking', emoji: '🥬', categoryId: categories[6].id, description: 'Plant-based cooking' },
    ] as Skill[]);

    await this.skillRepository.save([
      { name: 'Marketing', emoji: '📊', categoryId: categories[7].id, description: 'Digital marketing' },
      { name: 'Entrepreneurship', emoji: '🚀', categoryId: categories[7].id, description: 'Starting a business' },
      { name: 'Public Speaking', emoji: '🎙️', categoryId: categories[7].id, description: 'Public speaking' },
      { name: 'Finance', emoji: '💰', categoryId: categories[7].id, description: 'Personal finance' },
      { name: 'Math', emoji: '🔢', categoryId: categories[8].id, description: 'Mathematics tutoring' },
      { name: 'Physics', emoji: '⚛️', categoryId: categories[8].id, description: 'Physics tutoring' },
      { name: 'Chemistry', emoji: '🧪', categoryId: categories[8].id, description: 'Chemistry tutoring' },
      { name: 'History', emoji: '📜', categoryId: categories[8].id, description: 'History tutoring' },
      { name: 'Writing', emoji: '✍️', categoryId: categories[9].id, description: 'Creative writing' },
      { name: 'Chess', emoji: '♟️', categoryId: categories[9].id, description: 'Chess strategy' },
    ] as Skill[]);

    // Create demo users
    const password = await bcrypt.hash('password123', 10);
    const maria = await this.userRepository.save({
      name: 'Maria García',
      email: 'maria@example.com',
      password,
      bio: 'Full-stack developer and passionate teacher. Love helping others learn technology.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      location: 'Madrid, Spain',
      onboarded: true,
    } as unknown as User);

    const carlos = await this.userRepository.save({
      name: 'Carlos López',
      email: 'carlos@example.com',
      password,
      bio: 'Musician and aspiring developer. Teaching guitar while learning Python.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      location: 'Barcelona, Spain',
      onboarded: true,
    } as unknown as User);

    const ana = await this.userRepository.save({
      name: 'Ana Martínez',
      email: 'ana@example.com',
      password,
      bio: 'Yoga instructor and photographer. Looking to learn piano.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      location: 'Valencia, Spain',
      onboarded: true,
    } as unknown as User);

    // User skills
    await this.userSkillRepository.save([
      { userId: maria.id, skillId: techSkills[0].id, type: 'offering', sessionCount: 5 }, // Maria teaches Python
      { userId: maria.id, skillId: techSkills[4].id, type: 'offering', sessionCount: 3 }, // Maria teaches Angular
      { userId: carlos.id, skillId: techSkills[0].id, type: 'seeking', sessionCount: 2 }, // Carlos learns Python
      { userId: carlos.id, skillId: musicSkills[0].id, type: 'offering', sessionCount: 10 }, // Carlos teaches Guitar
      { userId: ana.id, skillId: wellnessSkills[0].id, type: 'offering', sessionCount: 8 }, // Ana teaches Yoga
      { userId: ana.id, skillId: artSkills[0].id, type: 'offering', sessionCount: 4 }, // Ana teaches Photography
      { userId: ana.id, skillId: musicSkills[1].id, type: 'seeking', sessionCount: 0 }, // Ana learns Piano
    ] as UserSkill[]);

    // Exchanges
    const exchange1 = await this.exchangeRepository.save({
      skillId: techSkills[0].id,
      senderId: carlos.id,
      receiverId: maria.id,
      message: '¡Hola María! Me encantaría aprender Python contigo. He visto que enseñas y tengo muchas ganas de empezar.',
      status: 'active',
    } as unknown as Exchange);

    const exchange2 = await this.exchangeRepository.save({
      skillId: musicSkills[0].id,
      senderId: ana.id,
      receiverId: carlos.id,
      message: 'Hola Carlos, me gustaría aprender guitarra. ¿Podemos hacer un intercambio?',
      status: 'pending',
    } as unknown as Exchange);

    // Sessions
    await this.sessionRepository.save([
      {
        exchangeId: exchange1.id,
        proposedById: carlos.id,
        date: '2026-07-25',
        startTime: '18:00',
        durationMinutes: 60,
        status: 'confirmed',
      },
      {
        exchangeId: exchange1.id,
        proposedById: maria.id,
        date: '2026-07-28',
        startTime: '17:00',
        durationMinutes: 90,
        status: 'pending',
      },
    ] as Session[]);

    // Messages
    await this.messageRepository.save([
      { exchangeId: exchange1.id, senderId: carlos.id, text: '¡Gracias por aceptar María! Estoy muy emocionado de aprender Python.' },
      { exchangeId: exchange1.id, senderId: maria.id, text: 'De nada Carlos! He visto que tocas la guitarra, ¿tal vez podamos hacer un intercambio más adelante?' },
      { exchangeId: exchange1.id, senderId: carlos.id, text: '¡Me encantaría! Podría enseñarte guitarra a cambio.' },
      { exchangeId: exchange1.id, senderId: maria.id, text: 'Perfecto! Empecemos con Python y luego organizamos las clases de guitarra.' },
      { exchangeId: exchange2.id, senderId: ana.id, text: 'Hola Carlos! me interesa aprender guitarra, ¿tienes disponibilidad?' },
    ] as Message[]);

    // Reviews
    await this.reviewRepository.save({
      exchangeId: exchange1.id,
      reviewerId: carlos.id,
      targetId: maria.id,
      rating: 5,
      text: 'María es una excelente profesora. Muy paciente y explica todo de forma muy clara. ¡100% recomendada!',
    } as Review);

    await this.reviewRepository.save({
      exchangeId: exchange1.id,
      reviewerId: maria.id,
      targetId: carlos.id,
      rating: 5,
      text: 'Carlos es un alumno muy aplicado y con mucho talento. Aprende muy rápido!',
    } as Review);

    // Update user ratings
    await this.userRepository.update(maria.id, { ratingAvg: 5, ratingCount: 1 });
    await this.userRepository.update(carlos.id, { ratingAvg: 5, ratingCount: 1 });
  }
}
