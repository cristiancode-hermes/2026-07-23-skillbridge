import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExchangeService } from '../services/exchange.service';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { Exchange, Session } from '../models';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { AvatarComponent } from '../shared/avatar.component';
import { SkillBadgeComponent } from '../shared/skill-badge.component';
import { SessionCardComponent } from '../shared/session-card.component';
import { MessageThreadComponent } from '../shared/message-thread.component';
import { ExchangeCardComponent } from '../shared/exchange-card.component';
import { LoadingSkeletonComponent } from '../shared/loading-skeleton.component';
import { ErrorAlertComponent } from '../shared/error-alert.component';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-exchange-detail',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    StatusBadgeComponent, AvatarComponent, SkillBadgeComponent,
    SessionCardComponent, MessageThreadComponent, ExchangeCardComponent,
    LoadingSkeletonComponent, ErrorAlertComponent,
  ],
  template: `
    <div class="page">
      @if (loading()) {
        <app-loading-skeleton type="card" />
      } @else if (error()) {
        <app-error-alert [message]="error()" (retry)="loadExchange()" />
      } @else if (exchange(); as ex) {
        <div class="detail-header">
          <a routerLink="/dashboard" class="btn btn-ghost btn-sm">← Dashboard</a>
          <h1 class="page-title">Exchange Details</h1>
        </div>

        <div class="card exchange-summary-card">
          <div class="exchange-top">
            <div class="exchange-people">
              <div class="person">
                <app-avatar [user]="{ name: ex.sender?.name, photoUrl: ex.sender?.photoUrl }" size="sm" />
                <span class="person-name">{{ ex.sender?.name }}</span>
                @if (ex.senderId === currentUserId()) { <span class="you-tag">You</span> }
              </div>
              <span class="exchange-arrow">⇄</span>
              <div class="person">
                <app-avatar [user]="{ name: ex.receiver?.name, photoUrl: ex.receiver?.photoUrl }" size="sm" />
                <span class="person-name">{{ ex.receiver?.name }}</span>
                @if (ex.receiverId === currentUserId()) { <span class="you-tag">You</span> }
              </div>
            </div>
            <app-status-badge [status]="ex.status" />
          </div>

          @if (ex.skill) {
            <div class="exchange-skill-row">
              <span class="exchange-skill-label">Skill:</span>
              <app-skill-badge [skill]="{ name: ex.skill.name, emoji: ex.skill.emoji }" type="offering" />
            </div>
          }

          @if (ex.message) {
            <div class="exchange-message-box">
              <span class="msg-label">Message:</span>
              <p class="msg-text">{{ ex.message }}</p>
            </div>
          }

          <div class="exchange-actions">
            @if (ex.status === 'pending' && ex.receiverId === currentUserId()) {
              <button class="btn btn-primary" (click)="acceptExchange()">Accept</button>
              <button class="btn btn-outline btn-danger" (click)="declineExchange()">Decline</button>
            }
            @if (ex.status === 'active') {
              <button class="btn btn-primary" (click)="completeExchange()">Mark Complete</button>
              <button class="btn btn-outline btn-danger" (click)="cancelExchange()">Cancel</button>
              <a [routerLink]="['/exchanges', ex.id, 'sessions', 'new']" class="btn btn-outline">
                Schedule Session
              </a>
            }
            @if (ex.status === 'pending' && ex.senderId === currentUserId()) {
              <button class="btn btn-outline btn-danger" (click)="cancelExchange()">Cancel Request</button>
            }
            @if (ex.status === 'completed') {
              <a [routerLink]="['/exchanges', ex.id, 'review']" class="btn btn-primary">Leave Review</a>
            }
          </div>
        </div>

        <section class="detail-section">
          <h2 class="section-title">Sessions</h2>
          @if (sessions().length === 0) {
            <div class="card sessions-empty">
              <p class="text-muted">No sessions scheduled yet.</p>
              @if (ex.status === 'active') {
                <a [routerLink]="['/exchanges', ex.id, 'sessions', 'new']" class="btn btn-outline btn-sm">Schedule First Session</a>
              }
            </div>
          } @else {
            <div class="sessions-list">
              @for (session of sessions(); track session.id) {
                <app-session-card
                  [session]="session"
                  [canEdit]="ex.status === 'active'"
                  (confirm)="confirmSession(session.id)"
                  (reschedule)="rescheduleSession(session.id)"
                  (cancel)="cancelSession(session.id)"
                />
              }
            </div>
          }
        </section>

        <section class="detail-section">
          <h2 class="section-title">Messages</h2>
          <div class="card message-card">
            <app-message-thread [exchangeId]="ex.id" />
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 720px; margin: 0 auto; }
    .detail-header { margin-bottom: 1.25rem; }
    .detail-header .btn { margin-bottom: 0.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--color-ink); }
    .exchange-summary-card { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem; margin-bottom: 2rem; }
    .exchange-top { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .exchange-people { display: flex; align-items: center; gap: 0.75rem; }
    .person { display: flex; align-items: center; gap: 0.5rem; }
    .person-name { font-weight: 600; font-size: 0.9375rem; color: var(--color-ink); }
    .you-tag { font-size: 0.6875rem; background: var(--color-primary-light); color: var(--color-primary); padding: 0.0625rem 0.375rem; border-radius: 4px; font-weight: 600; }
    .exchange-arrow { font-size: 1.25rem; color: var(--color-muted); }
    .exchange-skill-row { display: flex; align-items: center; gap: 0.5rem; }
    .exchange-skill-label { font-size: 0.8125rem; color: var(--color-muted); }
    .exchange-message-box { background: var(--color-bg); padding: 0.75rem 1rem; border-radius: 8px; }
    .msg-label { font-size: 0.75rem; font-weight: 600; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .msg-text { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--color-ink); }
    .exchange-actions { display: flex; gap: 0.625rem; flex-wrap: wrap; padding-top: 0.75rem; border-top: 1px solid var(--color-border); }
    .detail-section { margin-bottom: 2rem; }
    .section-title { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.75rem; color: var(--color-ink); }
    .sessions-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .sessions-empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem; text-align: center; }
    .text-muted { color: var(--color-muted); font-size: 0.875rem; margin: 0; }
    .message-card { padding: 0; overflow: hidden; }
  `],
})
export class ExchangeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exchangeService = inject(ExchangeService);
  private readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly exchange = signal<Exchange | null>(null);
  protected readonly sessions = signal<Session[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly currentUserId = () => this.authService.currentUser()?.id ?? 0;
  private exchangeId = 0;

  constructor() {
    this.exchangeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExchange();
  }

  protected loadExchange(): void {
    if (!this.exchangeId) { this.error.set('Exchange not found'); this.loading.set(false); return; }
    this.loading.set(true);
    this.error.set('');

    this.exchangeService.getById(this.exchangeId).subscribe({
      next: (ex) => {
        this.exchange.set(ex);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load exchange'); this.loading.set(false); },
    });

    this.sessionService.getByExchange(this.exchangeId).subscribe({
      next: (s) => this.sessions.set(s),
    });
  }

  protected acceptExchange(): void {
    this.exchangeService.accept(this.exchangeId).subscribe({
      next: (ex) => { this.exchange.set(ex); this.toast.success('Exchange accepted!'); },
      error: () => this.toast.error('Failed to accept'),
    });
  }

  protected declineExchange(): void {
    this.exchangeService.decline(this.exchangeId).subscribe({
      next: () => { this.toast.info('Exchange declined'); this.router.navigate(['/dashboard']); },
      error: () => this.toast.error('Failed to decline'),
    });
  }

  protected completeExchange(): void {
    this.exchangeService.complete(this.exchangeId).subscribe({
      next: (ex) => { this.exchange.set(ex); this.toast.success('Exchange completed!'); },
      error: () => this.toast.error('Failed to complete'),
    });
  }

  protected cancelExchange(): void {
    this.exchangeService.cancel(this.exchangeId).subscribe({
      next: () => { this.toast.info('Exchange cancelled'); this.router.navigate(['/dashboard']); },
      error: () => this.toast.error('Failed to cancel'),
    });
  }

  protected confirmSession(id: string | number): void {
    this.sessionService.confirm(id).subscribe({
      next: () => { this.toast.success('Session confirmed!'); this.loadExchange(); },
      error: () => this.toast.error('Failed to confirm session'),
    });
  }

  protected rescheduleSession(id: string | number): void {
    this.router.navigate(['/exchanges', this.exchangeId, 'sessions', id, 'edit']);
  }

  protected cancelSession(id: string | number): void {
    this.sessionService.remove(id).subscribe({
      next: () => { this.toast.info('Session cancelled'); this.loadExchange(); },
      error: () => this.toast.error('Failed to cancel session'),
    });
  }
}
