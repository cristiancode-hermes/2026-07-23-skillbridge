// ─── Entity Interfaces (compatible with both NestJS camelCase and old snake_case) ───

export interface AvatarUser {
  name?: string;
  photoUrl?: string;
  photo_url?: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  photoUrl?: string;
  photo_url?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  ratingAvg: number;
  ratingCount: number;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkillCategory {
  id: string | number;
  name: string;
  slug: string;
  emoji: string;
  icon?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Skill {
  id: string | number;
  name: string;
  emoji?: string;
  description?: string;
  categoryId: string | number;
  category?: SkillCategory;
  createdAt: string;
}

export interface UserSkill {
  id: string | number;
  userId: string | number;
  skillId: string | number;
  skill?: Skill;
  type: 'offering' | 'seeking';
  proficiency?: string;
  sessionCount: number;
  createdAt: string;
}

export type ExchangeStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'declined';

export interface Exchange {
  id: string | number;
  skillId: string | number;
  skill?: Skill;
  senderId: string | number;
  sender?: User;
  receiverId: string | number;
  receiver?: User;
  requester_id?: string;
  requester?: User;
  receiver_id?: string;
  message?: string;
  status: ExchangeStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'rescheduled';

export interface Session {
  id: string | number;
  exchangeId: string | number;
  proposedById: string | number;
  proposedBy?: User;
  date: string;
  startTime: string;
  durationMinutes: number;
  location?: string;
  meeting_link?: string;
  notes?: string;
  text?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string | number;
  exchangeId: string | number;
  reviewerId: string | number;
  reviewer?: User;
  targetId: string | number;
  target?: User;
  reviewee_id?: string;
  reviewee?: User;
  rating: number;
  text?: string;
  comment?: string;
  createdAt: string;
}

export interface Message {
  id: string | number;
  exchangeId: string | number;
  senderId: string | number;
  sender?: User;
  text: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string | number;
  userId: string | number;
  dayOfWeek: number;
  day_of_week?: number;
  startTime: string;
  start_time?: string;
  endTime: string;
  end_time?: string;
  is_active?: boolean;
  active?: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages?: number;
}

export interface DashboardStats {
  active: number;
  pending: number;
  completed: number;
  avgRating: number;
  // Legacy field names
  exchanges?: number;
  active_exchanges?: number;
  completed_exchanges?: number;
  pending_requests?: number;
  upcoming_sessions?: number;
  total_exchanges?: number;
  rating_average?: number;
  total_reviews?: number;
}

export interface PublicStats {
  members: number;
  skills: number;
  exchanges: number;
  satisfaction: number;
  // Legacy names
  total_users?: number;
  total_skills?: number;
  total_exchanges?: number;
  total_reviews?: number;
}
