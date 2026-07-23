import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3 class="empty-title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
      @if (actionLabel()) {
        <button class="btn btn-primary" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 3rem 1.5rem;
      }
      .empty-icon { font-size: 3rem; margin-bottom: 1rem; line-height: 1; }
      .empty-title { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 600; color: var(--color-ink); }
      .empty-message { margin: 0 0 1.25rem; font-size: 0.875rem; color: var(--color-muted); max-width: 320px; }
    `,
  ],
})
export class EmptyStateComponent {
  readonly icon = input('📭');
  readonly title = input('Nothing here');
  readonly message = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
