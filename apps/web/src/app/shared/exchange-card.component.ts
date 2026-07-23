import { Component, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Exchange } from '../models';
import { StatusBadgeComponent } from './status-badge.component';
import { AvatarComponent } from './avatar.component';
import { SkillBadgeComponent } from './skill-badge.component';

@Component({
  selector: 'app-exchange-card',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, AvatarComponent, SkillBadgeComponent],
  template: `
    <div class="card exchange-card">
      <div class="exchange-header">
        <div class="exchange-partners">
          <div class="partner-group">
            <app-avatar [user]="otherUser() ?? null" size="sm" />
            <span class="partner-name">{{ otherUser()?.name }}</span>
          </div>
          @if (exchange().skill) {
            <app-skill-badge
              [skill]="{ name: exchange().skill!.name, emoji: exchange().skill!.emoji }"
              [type]="userIsRequester() ? 'offering' : 'seeking'"
            />
          }
        </div>
        <app-status-badge [status]="exchange().status" />
      </div>

      @if (exchange().message) {
        <p class="exchange-message">{{ exchange().message }}</p>
      }

      <div class="exchange-meta">
        <span class="meta-date">{{ exchange().createdAt | date }}</span>
      </div>

      <div class="exchange-actions">
        @if (canAccept()) {
          <button class="btn btn-primary btn-sm" (click)="accept.emit()">Accept</button>
          <button class="btn btn-outline btn-sm" (click)="decline.emit()">Decline</button>
        }
        @if (canComplete()) {
          <button class="btn btn-primary btn-sm" (click)="complete.emit()">Complete</button>
        }
        @if (canCancel()) {
          <button class="btn btn-outline btn-sm btn-danger" (click)="cancel.emit()">Cancel</button>
        }
        <a [routerLink]="['/exchanges', exchange().id]" class="btn btn-ghost btn-sm">View Details</a>
      </div>
    </div>
  `,
  styles: [`
    .exchange-card { display: flex; flex-direction: column; gap: 0.75rem; }
    .exchange-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
    .exchange-partners { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .partner-group { display: flex; align-items: center; gap: 0.5rem; }
    .partner-name { font-weight: 600; font-size: 0.9375rem; color: var(--color-ink); }
    .exchange-message { font-size: 0.875rem; color: var(--color-muted); margin: 0; }
    .exchange-meta { font-size: 0.8125rem; color: var(--color-muted); }
    .exchange-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.5rem; border-top: 1px solid var(--color-border); }
  `],
})
export class ExchangeCardComponent {
  readonly exchange = input.required<Exchange>();
  readonly currentUserId = input.required<string>();

  readonly accept = output<void>();
  readonly decline = output<void>();
  readonly complete = output<void>();
  readonly cancel = output<void>();

  protected readonly userIsRequester = computed(
    () => this.exchange().sender?.id === this.currentUserId()
  );

  protected readonly otherUser = computed(() => {
    const exch = this.exchange();
    return this.userIsRequester() ? exch.receiver : exch.sender;
  });

  protected readonly canAccept = computed(
    () => !this.userIsRequester() && this.exchange().status === 'pending'
  );
  protected readonly canComplete = computed(
    () => this.exchange().status === 'active'
  );
  protected readonly canCancel = computed(
    () => this.exchange().status === 'pending' || this.exchange().status === 'active'
  );
}
