import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { ExchangeService } from '../services/exchange.service';
import { Session, Exchange } from '../models';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <a [routerLink]="['/exchanges', exchangeId]" class="btn btn-ghost btn-sm">← Back</a>
        <h1 class="page-title">{{ isEdit() ? 'Reschedule Session' : 'Schedule Session' }}</h1>
        <p class="page-subtitle">
          @if (isEdit()) {
            Update the date and time for this session.
          } @else {
            Set up a time to meet and exchange skills.
          }
        </p>
      </div>

      @if (loadingExchange()) {
        <div class="card"><p class="text-muted">Loading...</p></div>
      } @else if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      } @else {
        <form (ngSubmit)="submit()" class="session-form">
          <div class="card form-card">
            <div class="form-group">
              <label class="form-label" for="scheduledAt">Date & Time</label>
              <input
                id="scheduledAt"
                type="datetime-local"
                class="input"
                [(ngModel)]="scheduledAt"
                name="scheduledAt"
                required
              />
              <span class="form-hint">Choose a date and time that works for both of you.</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="duration">Duration (minutes)</label>
              <select id="duration" class="input" [(ngModel)]="durationMinutes" name="durationMinutes">
                <option [value]="15">15 min</option>
                <option [value]="30">30 min</option>
                <option [value]="45">45 min</option>
                <option [value]="60">60 min</option>
                <option [value]="90">90 min</option>
                <option [value]="120">2 hours</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="meetingLink">Meeting Link (optional)</label>
              <input
                id="meetingLink"
                class="input"
                [(ngModel)]="meetingLink"
                name="meetingLink"
                placeholder="https://meet.google.com/..."
              />
              <span class="form-hint">Add a video call link if meeting online.</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="text">Notes (optional)</label>
              <textarea
                id="text"
                class="input"
                [(ngModel)]="text"
                name="text"
                rows="3"
                placeholder="What will you cover in this session?"
              ></textarea>
            </div>

            <div class="form-actions">
              <a [routerLink]="['/exchanges', exchangeId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="submitting() || !scheduledAt">
                {{ submitting() ? 'Saving...' : isEdit() ? 'Update Session' : 'Schedule Session' }}
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 560px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header .btn { margin-bottom: 0.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .session-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .form-hint { font-size: 0.75rem; color: var(--color-muted); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; }
    .alert-danger { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .text-muted { color: var(--color-muted); font-size: 0.875rem; margin: 0; }
  `],
})
export class SessionFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly exchangeService = inject(ExchangeService);
  private readonly toast = inject(ToastService);

  protected readonly exchangeId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
  protected readonly loadingExchange = signal(true);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected scheduledAt = '';
  protected durationMinutes = 60;
  protected meetingLink = '';
  protected notes = '';

  protected isEdit = () => !!this.sessionId;

  constructor() {
    if (!this.exchangeId) {
      this.error.set('Exchange not found');
      this.loadingExchange.set(false);
      return;
    }

    this.exchangeService.getById(this.exchangeId).subscribe({
      next: () => this.loadingExchange.set(false),
      error: () => { this.error.set('Exchange not found'); this.loadingExchange.set(false); },
    });

    // If editing, load existing session data
    if (this.sessionId) {
      this.sessionService.getByExchange(this.exchangeId).subscribe({
        next: (sessions) => {
          const session = sessions.find(s => s.id === this.sessionId);
          if (session) {
            this.scheduledAt = session.date.slice(0, 16); // datetime-local format
            this.durationMinutes = session.durationMinutes;
            this.meetingLink = session.location || '';
            this.text = session.text || '';
          }
        },
      });
    }
  }

  protected submit(): void {
    if (!this.scheduledAt) return;

    this.submitting.set(true);
    this.error.set('');

    const data = {
      date: new Date(this.scheduledAt).toISOString(),
      durationMinutes: this.durationMinutes,
      notes: this.text || undefined,
      location: this.meetingLink || undefined,
    };

    const action = this.isEdit()
      ? this.sessionService.update(this.sessionId, data)
      : this.sessionService.create(this.exchangeId, data);

    action.subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success(this.isEdit() ? 'Session updated!' : 'Session scheduled!');
        this.router.navigate(['/exchanges', this.exchangeId]);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Failed to save session');
      },
    });
  }
}
