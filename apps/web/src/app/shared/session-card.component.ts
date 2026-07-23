import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Session } from '../models';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  template: `
    <div class="card session-card">
      <div class="session-header">
        <app-status-badge [status]="session().status" />
        @if (canEdit()) {
          <div class="session-actions-top">
            <button class="btn btn-ghost btn-sm" (click)="reschedule.emit()" title="Reschedule">↻</button>
            <button class="btn btn-ghost btn-sm" (click)="cancel.emit()" title="Cancel">✕</button>
          </div>
        }
      </div>

      <div class="session-info">
        <div class="session-date">
          <span class="info-label">Date</span>
          <span class="info-value">{{ session().date | date:'mediumDate' }}</span>
        </div>
        <div class="session-time">
          <span class="info-label">Time</span>
          <span class="info-value">{{ session().startTime }}</span>
        </div>
        <div class="session-duration">
          <span class="info-label">Duration</span>
          <span class="info-value">{{ session().durationMinutes }} min</span>
        </div>
      </div>

      @if (session().location) {
        <a [href]="session().location" target="_blank" class="meeting-link">
          Join Meeting ↗
        </a>
      }

      <div class="session-actions">
        @if (session().status === 'pending') {
          <button class="btn btn-primary btn-sm" (click)="confirm.emit()">Confirm</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .session-card { display: flex; flex-direction: column; gap: 0.75rem; }
    .session-header { display: flex; justify-content: space-between; align-items: center; }
    .session-actions-top { display: flex; gap: 0.25rem; }
    .session-info { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .info-label { display: block; font-size: 0.75rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { font-size: 0.9375rem; font-weight: 500; color: var(--color-ink); }
    .meeting-link { font-size: 0.875rem; font-weight: 600; color: var(--color-primary); text-decoration: none; }
    .meeting-link:hover { text-decoration: underline; }
    .session-actions { display: flex; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--color-border); }
  `],
})
export class SessionCardComponent {
  readonly session = input.required<Session>();
  readonly canEdit = input(false);
  readonly confirm = output<void>();
  readonly reschedule = output<void>();
  readonly cancel = output<void>();
}
