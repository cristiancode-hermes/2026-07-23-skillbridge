import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExchangeService } from '../services/exchange.service';
import { SkillService } from '../services/skill.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Skill, User } from '../models';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-exchange-request',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <a [routerLink]="['/skills']" class="btn btn-ghost btn-sm">← Back to Skills</a>
        <h1 class="page-title">Request Skill Exchange</h1>
      </div>

      @if (loading()) {
        <div class="card"><p class="text-muted">Loading details...</p></div>
      } @else if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      } @else {
        <div class="card exchange-form-card">
          @if (skill(); as s) {
            <div class="exchange-summary">
              <span class="summary-emoji">{{ s.emoji || '📚' }}</span>
              <div>
                <h3>{{ s.name }}</h3>
                @if (s.description) { <p class="text-muted text-sm">{{ s.description }}</p> }
              </div>
            </div>
          }

          @if (receiver(); as r) {
            <div class="exchange-partner">
              <span class="text-sm text-muted">With:</span>
              <span class="partner-name">{{ r.name }}</span>
            </div>
          }

          <form (ngSubmit)="submit()" class="request-form">
            <div class="form-group">
              <label class="form-label" for="message">Message</label>
              <textarea
                id="message"
                class="input"
                [(ngModel)]="message"
                name="message"
                rows="4"
                placeholder="Introduce yourself and explain what you'd like to learn or teach..."
              ></textarea>
              <span class="form-hint">Optional, but a friendly message goes a long way.</span>
            </div>

            <div class="form-actions">
              <a [routerLink]="['/skills']" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="submitting()">
                {{ submitting() ? 'Sending...' : 'Send Request' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 600px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header .btn { margin-bottom: 0.75rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--color-ink); }
    .exchange-form-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .exchange-summary { display: flex; align-items: flex-start; gap: 0.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }
    .summary-emoji { font-size: 2rem; line-height: 1; }
    .exchange-summary h3 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--color-ink); }
    .exchange-partner { display: flex; align-items: center; gap: 0.5rem; }
    .partner-name { font-weight: 600; font-size: 0.9375rem; color: var(--color-ink); }
    .request-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .form-hint { font-size: 0.75rem; color: var(--color-muted); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; }
    .alert-danger { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .text-muted { color: var(--color-muted); }
    .text-sm { font-size: 0.8125rem; }
  `],
})
export class ExchangeRequestComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exchangeService = inject(ExchangeService);
  private readonly skillService = inject(SkillService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly skill = signal<Skill | null>(null);
  protected readonly receiver = signal<User | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly submitting = signal(false);

  protected message = '';

  constructor() {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    if (!skillId) {
      this.error.set('Invalid request: missing skill');
      this.loading.set(false);
      return;
    }

    this.skillService.getById(skillId).subscribe({
      next: (s) => {
        this.skill.set(s);
        this.loading.set(false);
      },
      error: () => { this.error.set('Skill not found'); this.loading.set(false); },
    });

    if (userId) {
      this.userService.getProfile(userId).subscribe({
        next: (u) => this.receiver.set(u),
        error: () => {},
      });
    }
  }

  protected submit(): void {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    let userId = Number(this.route.snapshot.paramMap.get('userId'));

    if (!userId) {
      // If no specific user, pick the first user from the skill's category or a random user
      this.toast.error('Please select a user to exchange with from their profile page');
      return;
    }

    if (userId === this.authService.currentUser()?.id) {
      this.toast.error('You cannot request an exchange with yourself');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.exchangeService.create({
      skillId: skillId,
      receiverId: userId,
      message: this.message || undefined,
    }).subscribe({
      next: (exchange) => {
        this.submitting.set(false);
        this.toast.success('Exchange request sent!');
        this.router.navigate(['/exchanges', exchange.id]);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Failed to send exchange request');
      },
    });
  }
}
