import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { DashboardStats, Exchange } from '../models';
import { ExchangeCardComponent } from '../shared/exchange-card.component';
import { LoadingSkeletonComponent } from '../shared/loading-skeleton.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { ErrorAlertComponent } from '../shared/error-alert.component';
import { ToastService } from '../shared/toast.component';

type Tab = 'all' | 'pending' | 'active' | 'completed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DatePipe,
    ExchangeCardComponent, LoadingSkeletonComponent,
    EmptyStateComponent, ErrorAlertComponent,
  ],
  template: `
    <div class="page-wide">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ currentUser()?.name ?? 'User' }}!</p>
        </div>
        <a routerLink="/skills" class="btn btn-primary">Browse Skills</a>
      </div>

      @if (statsLoading()) {
        <div class="kpi-grid">
          @for (_ of [1,2,3,4]; track $index) {
            <div class="card kpi-card">
              <div class="skeleton-line skeleton-line-sm" style="width:40%;margin-bottom:0.5rem"></div>
              <div class="skeleton-line skeleton-line-lg" style="width:60%"></div>
            </div>
          }
        </div>
      } @else if (statsError()) {
        <app-error-alert [message]="statsError()" (retry)="loadStats()" />
      } @else {
        <div class="kpi-grid">
          <div class="card kpi-card">
            <span class="kpi-icon">🔄</span>
            <div class="kpi-info">
              <span class="kpi-value">{{ stats()?.exchanges ?? 0 }}</span>
              <span class="kpi-label">Total Exchanges</span>
            </div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">⚡</span>
            <div class="kpi-info">
              <span class="kpi-value">{{ stats()?.active_exchanges ?? 0 }}</span>
              <span class="kpi-label">Active</span>
            </div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">✅</span>
            <div class="kpi-info">
              <span class="kpi-value">{{ stats()?.completed_exchanges ?? 0 }}</span>
              <span class="kpi-label">Completed</span>
            </div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">⏳</span>
            <div class="kpi-info">
              <span class="kpi-value">{{ stats()?.pending_requests ?? 0 }}</span>
              <span class="kpi-label">Pending</span>
            </div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">📅</span>
            <div class="kpi-info">
              <span class="kpi-value">{{ stats()?.upcoming_sessions ?? 0 }}</span>
              <span class="kpi-label">Upcoming Sessions</span>
            </div>
          </div>
          @if (stats()?.avgRating) {
            <div class="card kpi-card">
              <span class="kpi-icon">⭐</span>
              <div class="kpi-info">
                <span class="kpi-value">{{ stats()?.avgRating?.toFixed(1) }}</span>
                <span class="kpi-label">Avg Rating</span>
              </div>
            </div>
          }
        </div>
      }

      <div class="section-header">
        <h2 class="section-title">Exchanges</h2>
        <div class="tabs">
          @for (tab of tabs; track tab.value) {
            <button
              class="tab-btn"
              [class.tab-active]="activeTab() === tab.value"
              (click)="setTab(tab.value)"
            >{{ tab.label }}</button>
          }
        </div>
      </div>

      @if (exchangesLoading()) {
        <app-loading-skeleton type="card" />
        <app-loading-skeleton type="card" />
      } @else if (exchangesError()) {
        <app-error-alert [message]="exchangesError()" (retry)="loadExchanges()" />
      } @else if (exchanges().length === 0) {
        <app-empty-state
          icon="🤝"
          title="No exchanges yet"
          message="Browse skills to find someone to exchange with!"
          actionLabel="Browse Skills"
          (action)="goToSkills()"
        />
      } @else {
        <div class="exchange-list">
          @for (exchange of exchanges(); track exchange.id) {
            <app-exchange-card
              [exchange]="exchange"
              [currentUserId]="currentUserId()"
              (accept)="acceptExchange(exchange.id)"
              (decline)="declineExchange(exchange.id)"
              (complete)="completeExchange(exchange.id)"
              (cancel)="cancelExchange(exchange.id)"
            />
          }
        </div>
        @if (totalPages() > 1) {
          <div class="pagination">
            <button
              class="btn btn-outline btn-sm"
              [disabled]="currentPage() <= 1"
              (click)="changePage(currentPage() - 1)"
            >← Previous</button>
            <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button
              class="btn btn-outline btn-sm"
              [disabled]="currentPage() >= totalPages()"
              (click)="changePage(currentPage() + 1)"
            >Next →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-wide { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    .page-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .kpi-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .kpi-icon { font-size: 2rem; line-height: 1; }
    .kpi-info { display: flex; flex-direction: column; }
    .kpi-value { font-size: 1.5rem; font-weight: 700; color: var(--color-ink); line-height: 1.2; }
    .kpi-label { font-size: 0.8125rem; color: var(--color-muted); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem; }
    .section-title { font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--color-ink); }
    .tabs { display: flex; gap: 0.25rem; background: var(--color-surface); border-radius: 8px; padding: 0.25rem; }
    .tab-btn { padding: 0.375rem 0.75rem; border: none; background: transparent; border-radius: 6px; font-size: 0.8125rem; font-weight: 500; color: var(--color-muted); cursor: pointer; transition: all 0.15s; }
    .tab-btn:hover { color: var(--color-ink); }
    .tab-active { background: var(--color-bg); color: var(--color-ink); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .exchange-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { font-size: 0.8125rem; color: var(--color-muted); }
    .skeleton-line { height: 12px; background: var(--color-surface-hover); border-radius: 4px; animation: pulse 1.5s ease-in-out infinite; }
    .skeleton-line-sm { width: 40%; }
    .skeleton-line-lg { width: 90%; height: 16px; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  `],
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  protected readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly currentUserId = () => this.currentUser()?.id ?? 0;

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly statsLoading = signal(true);
  protected readonly statsError = signal('');

  protected readonly exchanges = signal<Exchange[]>([]);
  protected readonly exchangesLoading = signal(true);
  protected readonly exchangesError = signal('');

  protected readonly activeTab = signal<Tab>('all');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);

  protected readonly tabs: { label: string; value: Tab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  constructor() {
    this.loadStats();
    this.loadExchanges();
  }

  protected loadStats(): void {
    this.statsLoading.set(true);
    this.statsError.set('');
    this.dashboardService.getStats().subscribe({
      next: (s) => { this.stats.set(s); this.statsLoading.set(false); },
      error: () => { this.statsError.set('Failed to load stats'); this.statsLoading.set(false); },
    });
  }

  protected loadExchanges(): void {
    this.exchangesLoading.set(true);
    this.exchangesError.set('');
    const status = this.activeTab() === 'all' ? undefined : this.activeTab();
    this.dashboardService.getExchanges(status).subscribe({
      next: (res) => {
        this.exchanges.set(res.skills);
        this.totalPages.set(res.total_pages);
        this.currentPage.set(res.page);
        this.exchangesLoading.set(false);
      },
      error: () => { this.exchangesError.set('Failed to load exchanges'); this.exchangesLoading.set(false); },
    });
  }

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.loadExchanges();
  }

  protected changePage(page: number): void {
    this.currentPage.set(page);
    this.loadExchanges();
  }

  protected goToSkills(): void {
    window.location.href = '/skills';
  }

  protected acceptExchange(id: number): void {
    this.dashboardService['api']?.patch(`/exchanges/${id}/accept`).subscribe({
      next: () => { this.toast.success('Exchange accepted!'); this.loadExchanges(); },
      error: () => this.toast.error('Failed to accept exchange'),
    });
  }

  protected declineExchange(id: number): void {
    this.dashboardService['api']?.patch(`/exchanges/${id}/decline`).subscribe({
      next: () => { this.toast.success('Exchange declined'); this.loadExchanges(); },
      error: () => this.toast.error('Failed to decline exchange'),
    });
  }

  protected completeExchange(id: number): void {
    this.dashboardService['api']?.patch(`/exchanges/${id}/complete`).subscribe({
      next: () => { this.toast.success('Exchange completed!'); this.loadExchanges(); },
      error: () => this.toast.error('Failed to complete exchange'),
    });
  }

  protected cancelExchange(id: number): void {
    this.dashboardService['api']?.patch(`/exchanges/${id}/cancel`).subscribe({
      next: () => { this.toast.success('Exchange cancelled'); this.loadExchanges(); },
      error: () => this.toast.error('Failed to cancel exchange'),
    });
  }
}
