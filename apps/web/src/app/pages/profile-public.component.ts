import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserSkillService } from '../services/user-skill.service';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { User, UserSkill, Review } from '../models';
import { AvatarComponent } from '../shared/avatar.component';
import { SkillBadgeComponent } from '../shared/skill-badge.component';
import { StarRatingComponent } from '../shared/star-rating.component';
import { LoadingSkeletonComponent } from '../shared/loading-skeleton.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { ErrorAlertComponent } from '../shared/error-alert.component';

@Component({
  selector: 'app-profile-public',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    AvatarComponent, SkillBadgeComponent, StarRatingComponent,
    LoadingSkeletonComponent, EmptyStateComponent, ErrorAlertComponent,
  ],
  template: `
    <div class="page">
      @if (loading()) {
        <app-loading-skeleton type="card" />
        <app-loading-skeleton type="list" />
      } @else if (error()) {
        <app-error-alert [message]="error()" (retry)="loadProfile()" />
      } @else if (profile(); as user) {
        <div class="profile-header card">
          <div class="profile-info">
            <app-avatar [user]="{ name: user.name, photoUrl: user.photoUrl }" size="lg" />
            <div class="profile-details">
              <h1 class="profile-name">{{ user.name }}</h1>
              @if (user.bio) {
                <p class="profile-bio">{{ user.bio }}</p>
              }
              <p class="profile-meta">
                Member since {{ user.createdAt | date:'yyyy' }}
                @if (user.timezone) { · {{ user.timezone }} }
              </p>
            </div>
          </div>
          @if (isOwnProfile()) {
            <a routerLink="/profile/edit" class="btn btn-outline btn-sm">Edit Profile</a>
          }
        </div>

        <section class="profile-section">
          <h2 class="section-title">Skills</h2>
          @if (skillsLoading()) {
            <app-loading-skeleton type="list" />
          } @else if (skills().length === 0) {
            <app-empty-state icon="📚" title="No skills yet" message="This user hasn't added any skills." />
          } @else {
            <div class="skills-list">
              @for (us of skills(); track us.id) {
                <div class="card skill-item">
                  <div class="skill-item-top">
                    <span class="skill-emoji">{{ us.skill?.emoji || '📚' }}</span>
                    <span class="skill-name">{{ us.skill?.name }}</span>
                    <app-skill-badge [skill]="{ name: us.type, emoji: '' }" [type]="us.type" />
                  </div>
                  @if (us.proficiency) {
                    <span class="skill-proficiency">{{ us.proficiency }}</span>
                  }
                </div>
              }
            </div>
          }
        </section>

        <section class="profile-section">
          <h2 class="section-title">
            Reviews
            @if (reviews().length > 0) {
              <span class="review-count">({{ reviews().length }})</span>
            }
          </h2>
          @if (reviewsLoading()) {
            <app-loading-skeleton type="list" />
          } @else if (reviews().length === 0) {
            <app-empty-state icon="💬" title="No reviews yet" />
          } @else {
            <div class="reviews-list">
              @for (review of reviews(); track review.id) {
                <div class="card review-item">
                  <div class="review-header">
                    @if (review.reviewer) {
                      <app-avatar [user]="{ name: review.reviewer.name, photoUrl: review.reviewer.photoUrl }" size="sm" />
                      <span class="reviewer-name">{{ review.reviewer.name }}</span>
                    }
                    <app-star-rating [rating]="review.rating" size="sm" />
                  </div>
                  @if (review.text) {
                    <p class="review-comment">{{ review.text }}</p>
                  }
                  <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 720px; margin: 0 auto; }
    .profile-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 2rem; }
    .profile-info { display: flex; gap: 1.25rem; align-items: flex-start; }
    .profile-details { display: flex; flex-direction: column; gap: 0.25rem; }
    .profile-name { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--color-ink); }
    .profile-bio { font-size: 0.9375rem; color: var(--color-ink); margin: 0.25rem 0; line-height: 1.5; }
    .profile-meta { font-size: 0.8125rem; color: var(--color-muted); margin: 0; }
    .profile-section { margin-bottom: 2rem; }
    .section-title { font-size: 1.125rem; font-weight: 700; margin: 0 0 1rem; color: var(--color-ink); display: flex; align-items: center; gap: 0.5rem; }
    .review-count { font-size: 0.875rem; font-weight: 400; color: var(--color-muted); }
    .skills-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .skill-item { display: flex; flex-direction: column; gap: 0.375rem; padding: 0.875rem 1rem; }
    .skill-item-top { display: flex; align-items: center; gap: 0.625rem; }
    .skill-emoji { font-size: 1.25rem; line-height: 1; }
    .skill-name { font-weight: 600; font-size: 0.9375rem; color: var(--color-ink); flex: 1; }
    .skill-proficiency { font-size: 0.8125rem; color: var(--color-muted); }
    .reviews-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .review-item { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 1.25rem; }
    .review-header { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
    .reviewer-name { font-weight: 600; font-size: 0.875rem; color: var(--color-ink); }
    .review-comment { margin: 0; font-size: 0.875rem; color: var(--color-ink); line-height: 1.5; }
    .review-date { font-size: 0.75rem; color: var(--color-muted); }
  `],
})
export class ProfilePublicComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly userSkillService = inject(UserSkillService);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);

  protected readonly profile = signal<User | null>(null);
  protected readonly skills = signal<UserSkill[]>([]);
  protected readonly reviews = signal<Review[]>([]);
  protected readonly loading = signal(true);
  protected readonly skillsLoading = signal(true);
  protected readonly reviewsLoading = signal(true);
  protected readonly error = signal('');

  protected readonly isOwnProfile = computed(() => {
    const p = this.profile();
    return p && this.authService.currentUser()?.id === p.id;
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadProfile(id);
      else this.loadProfile(Number(this.authService.currentUser()?.id));
    });
  }

  protected loadProfile(userId?: number): void {
    const id = userId || this.authService.currentUser()?.id;
    if (!id) return;

    this.loading.set(true);
    this.error.set('');

    this.userService.getProfile(id).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load profile'); this.loading.set(false); },
    });

    this.userSkillService.getUserSkills(id).subscribe({
      next: (s) => this.skills.set(s),
      error: () => this.skills.set([]),
      complete: () => this.skillsLoading.set(false),
    });

    this.reviewService.getUserReviews(Number(id)).subscribe({
      next: (r) => this.reviews.set(r),
      error: () => this.reviews.set([]),
      complete: () => this.reviewsLoading.set(false),
    });
  }
}
