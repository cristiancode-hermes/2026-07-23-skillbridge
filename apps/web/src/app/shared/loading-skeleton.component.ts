import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-wrapper">
      @switch (type()) {
        @case ('card') {
          <div class="skeleton-card">
            <div class="skeleton-line skeleton-line-lg"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line-sm"></div>
          </div>
        }
        @case ('list') {
          <div class="skeleton-list">
            @for (_ of [1,2,3]; track _) {
              <div class="skeleton-row">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-list-content">
                  <div class="skeleton-line skeleton-line-md"></div>
                  <div class="skeleton-line skeleton-line-sm"></div>
                </div>
              </div>
            }
          </div>
        }
        @case ('table') {
          <div class="skeleton-table">
            <div class="skeleton-header-row">
              @for (_ of [1,2,3,4]; track _) {
                <div class="skeleton-line skeleton-line-md"></div>
              }
            </div>
            @for (_ of [1,2,3,4]; track _) {
              <div class="skeleton-row">
                @for (__ of [1,2,3,4]; track __) {
                  <div class="skeleton-line"></div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .skeleton-wrapper { width: 100%; }
      .skeleton-line {
        height: 12px;
        background: var(--color-surface-hover);
        border-radius: 4px;
        margin-bottom: 0.5rem;
        animation: pulse 1.5s ease-in-out infinite;
      }
      .skeleton-line-sm { width: 40%; }
      .skeleton-line-md { width: 65%; }
      .skeleton-line-lg { width: 90%; height: 16px; }

      .skeleton-card {
        padding: 1.25rem;
        border-radius: 12px;
        border: 1px solid var(--color-border);
      }
      .skeleton-list { display: flex; flex-direction: column; gap: 0.75rem; }
      .skeleton-row { display: flex; gap: 0.75rem; align-items: center; }
      .skeleton-avatar {
        width: 40px; height: 40px;
        border-radius: 50%;
        background: var(--color-surface-hover);
        animation: pulse 1.5s ease-in-out infinite;
        flex-shrink: 0;
      }
      .skeleton-list-content { flex: 1; }
      .skeleton-table { display: flex; flex-direction: column; gap: 0.5rem; }
      .skeleton-header-row { display: flex; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--color-border); }
      .skeleton-table .skeleton-row { display: flex; gap: 1rem; }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `,
  ],
})
export class LoadingSkeletonComponent {
  readonly type = input<'card' | 'list' | 'table'>('card');
}
