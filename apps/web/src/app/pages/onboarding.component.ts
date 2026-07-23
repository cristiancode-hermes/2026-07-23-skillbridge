import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { SkillService } from '../services/skill.service';
import { UserSkillService } from '../services/user-skill.service';
import { AvailabilityService } from '../services/availability.service';
import { Skill } from '../models';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="onboarding-page">
      <div class="onboarding-card card">
        <div class="steps-indicator">
          @for (step of [1,2,3]; track step) {
            <div class="step-dot" [class.step-active]="step <= currentStep()" [class.step-current]="step === currentStep()">
              <span class="step-num">{{ step }}</span>
            </div>
            @if (step < 3) { <div class="step-line" [class.step-line-done]="step < currentStep()"></div> }
          }
        </div>

        <div class="step-labels">
          <span [class.label-active]="currentStep() >= 1">Profile</span>
          <span [class.label-active]="currentStep() >= 2">Skills</span>
          <span [class.label-active]="currentStep() >= 3">Availability</span>
        </div>

        @switch (currentStep()) {
          @case (1) {
            <div class="step-content slide-up">
              <h2>Set up your profile</h2>
              <p class="step-hint">Tell us about yourself so others can get to know you.</p>
              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input class="input" [(ngModel)]="name" placeholder="Your name" />
              </div>
              <div class="form-group">
                <label class="form-label">Bio</label>
                <textarea class="input" [(ngModel)]="bio" placeholder="A short bio about yourself..." rows="3"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Photo URL</label>
                <input class="input" [(ngModel)]="photoUrl" placeholder="https://..." />
              </div>
              <div class="step-actions">
                <button class="btn btn-primary" (click)="nextStep()">Continue</button>
              </div>
            </div>
          }
          @case (2) {
            <div class="step-content slide-up">
              <h2>Add your skills</h2>
              <p class="step-hint">What can you teach? What do you want to learn?</p>
              <div class="search-box">
                <input class="input" [(ngModel)]="skillSearch" placeholder="Search skills..." (input)="searchSkills()" />
              </div>
              @if (searchResults().length > 0) {
                <div class="search-results">
                  @for (s of searchResults(); track s.id) {
                    <div class="search-result-item" (click)="toggleSkill(s)">
                      <span class="skill-emoji-sm">{{ s.emoji || '📚' }}</span>
                      <span>{{ s.name }}</span>
                      @if (selectedSkills().includes(s.id)) { <span class="check-mark">✓</span> }
                    </div>
                  }
                </div>
              }
              <div class="selected-skills">
                @for (skillId of selectedSkills(); track skillId) {
                  @if (getSkillById(skillId); as s) {
                    <span class="selected-skill-tag">
                      {{ s.emoji || '📚' }} {{ s.name }}
                      <button class="tag-remove" (click)="removeSkill(skillId)">✕</button>
                    </span>
                  }
                }
              </div>
              <div class="step-actions">
                <button class="btn btn-ghost" (click)="prevStep()">Back</button>
                <button class="btn btn-primary" (click)="nextStep()" [disabled]="selectedSkills().length === 0">
                  Continue ({{ selectedSkills().length }})
                </button>
              </div>
            </div>
          }
          @case (3) {
            <div class="step-content slide-up">
              <h2>Set your availability</h2>
              <p class="step-hint">When are you generally free for skill exchange sessions?</p>
              @for (day of days; track day.value) {
                <div class="availability-row">
                  <label class="day-label">
                    <input type="checkbox" [checked]="availability()[day.value]?.enabled" (change)="toggleDay(day.value)" />
                    {{ day.label }}
                  </label>
                  @if (availability()[day.value]?.enabled) {
                    <div class="time-inputs">
                      <input type="time" class="input time-input" [value]="availability()[day.value]?.start || '09:00'"
                        (change)="setTime(day.value, 'start', $any($event).target.value)" />
                      <span class="time-sep">to</span>
                      <input type="time" class="input time-input" [value]="availability()[day.value]?.end || '17:00'"
                        (change)="setTime(day.value, 'end', $any($event).target.value)" />
                    </div>
                  }
                </div>
              }
              <div class="step-actions">
                <button class="btn btn-ghost" (click)="prevStep()">Back</button>
                <button class="btn btn-primary" (click)="finish()" [disabled]="saving()">
                  {{ saving() ? 'Saving...' : 'Complete Setup' }}
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page { max-width: 540px; margin: 0 auto; padding: 2rem 0; }
    .onboarding-card { padding: 2rem; }
    .steps-indicator { display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--color-surface-hover); color: var(--color-muted); font-size: 0.8125rem; font-weight: 600; transition: all 0.2s; }
    .step-active { background: var(--color-primary); color: #fff; }
    .step-current { box-shadow: 0 0 0 3px var(--color-primary-light); }
    .step-line { width: 48px; height: 2px; background: var(--color-border); margin: 0 0.5rem; }
    .step-line-done { background: var(--color-primary); }
    .step-labels { display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 0.75rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .label-active { color: var(--color-primary); font-weight: 600; }
    .step-content { }
    .step-content h2 { font-size: 1.375rem; font-weight: 700; margin: 0 0 0.375rem; color: var(--color-ink); }
    .step-hint { font-size: 0.875rem; color: var(--color-muted); margin: 0 0 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .step-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
    .search-box { margin-bottom: 0.75rem; }
    .search-results { max-height: 200px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 1rem; }
    .search-result-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem; color: var(--color-ink); transition: background 0.1s; }
    .search-result-item:hover { background: var(--color-surface-hover); }
    .skill-emoji-sm { font-size: 1rem; }
    .check-mark { margin-left: auto; color: var(--color-primary); font-weight: 700; }
    .selected-skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .selected-skill-tag { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; background: var(--color-primary-light); color: var(--color-primary); border-radius: 999px; font-size: 0.8125rem; font-weight: 500; }
    .tag-remove { background: none; border: none; cursor: pointer; color: var(--color-primary); font-size: 0.75rem; padding: 0; line-height: 1; }
    .availability-row { display: flex; align-items: center; gap: 1rem; padding: 0.625rem 0; border-bottom: 1px solid var(--color-border); }
    .day-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--color-ink); min-width: 120px; cursor: pointer; }
    .day-label input { accent-color: var(--color-primary); }
    .time-inputs { display: flex; align-items: center; gap: 0.5rem; }
    .time-input { width: 110px; padding: 0.3125rem 0.5rem; font-size: 0.8125rem; }
    .time-sep { font-size: 0.8125rem; color: var(--color-muted); }
    .slide-up { animation: slideUp 0.25s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class OnboardingComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly skillService = inject(SkillService);
  private readonly userSkillService = inject(UserSkillService);
  private readonly availabilityService = inject(AvailabilityService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly currentStep = signal(1);
  protected readonly saving = signal(false);

  // Step 1: Profile
  protected name = this.authService.currentUser()?.name || '';
  protected bio = this.authService.currentUser()?.bio || '';
  protected photoUrl = this.authService.currentUser()?.photoUrl || '';

  // Step 2: Skills
  protected readonly allSkills = signal<Skill[]>([]);
  protected readonly searchResults = signal<Skill[]>([]);
  protected readonly selectedSkills = signal<number[]>([]);
  protected readonly selectedSkillMap = signal<Map<number, Skill>>(new Map());
  protected skillSearch = '';

  // Step 3: Availability
  protected readonly availability = signal<Record<number, { enabled: boolean; start: string; end: string }>>({
    0: { enabled: false, start: '09:00', end: '17:00' },
    2: { enabled: false, start: '09:00', end: '17:00' },
    3: { enabled: false, start: '09:00', end: '17:00' },
    4: { enabled: false, start: '09:00', end: '17:00' },
    5: { enabled: false, start: '09:00', end: '17:00' },
    6: { enabled: false, start: '09:00', end: '17:00' },
    1: { enabled: false, start: '09:00', end: '17:00' },
  });

  protected readonly days = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  constructor() {
    this.skillService.getAll().subscribe({
      next: (res) => {
        this.allSkills.set(res.skills);
        this.searchResults.set(res.skills);
      },
    });
  }

  protected searchSkills(): void {
    const q = this.skillSearch.toLowerCase().trim();
    if (!q) {
      this.searchResults.set(this.allSkills());
      return;
    }
    this.searchResults.set(
      this.allSkills().filter(s => s.name.toLowerCase().includes(q))
    );
  }

  protected toggleSkill(skill: Skill): void {
    const current = this.selectedSkills();
    if (current.includes(skill.id)) {
      this.selectedSkills.set(current.filter(id => id !== skill.id));
    } else {
      this.selectedSkills.set([...current, skill.id]);
      const map = this.selectedSkillMap();
      map.set(skill.id, skill);
      this.selectedSkillMap.set(new Map(map));
    }
  }

  protected getSkillById(id: number): Skill | undefined {
    return this.selectedSkillMap().get(id) || this.allSkills().find(s => s.id === id);
  }

  protected removeSkill(id: number): void {
    this.selectedSkills.set(this.selectedSkills().filter(sid => sid !== id));
    const map = this.selectedSkillMap();
    map.delete(id);
    this.selectedSkillMap.set(new Map(map));
  }

  protected toggleDay(day: number): void {
    const av = { ...this.availability() };
    av[day] = { ...av[day], enabled: !av[day].enabled };
    this.availability.set(av);
  }

  protected setTime(day: number, field: 'start' | 'end', value: string): void {
    const av = { ...this.availability() };
    av[day] = { ...av[day], [field]: value };
    this.availability.set(av);
  }

  protected nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  protected prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  protected finish(): void {
    this.saving.set(true);
    this.userService.updateProfile({ name: this.name, bio: this.bio, photoUrl: this.photoUrl })
      .subscribe({
        next: async () => {
          // Add selected skills
          for (const skillId of this.selectedSkills()) {
            try {
              await new Promise<void>((resolve, reject) =>
                this.userSkillService.addSkill(skillId, 'offering').subscribe({ next: () => resolve(), error: reject })
              );
            } catch { /* skip duplicates */ }
          }

          // Save availability
          const slots = Object.entries(this.availability())
            .filter(([, v]) => v.enabled)
            .map(([day, v]) => ({
              day_of_week: Number(day),
              start_time: v.start,
              end_time: v.end,
              active: true,
            }));

          if (slots.length > 0) {
            this.availabilityService.updateSlots(slots).subscribe();
          }

          this.saving.set(false);
          this.toast.success('Welcome to SkillBridge!');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Failed to save profile');
        },
      });
  }
}
