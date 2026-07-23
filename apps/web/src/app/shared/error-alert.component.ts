import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    <div class="error-alert">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p class="error-message">{{ message() }}</p>
      </div>
      <button class="btn btn-outline btn-sm" (click)="retry.emit()">
        Retry
      </button>
    </div>
  `,
  styles: [
    `
      .error-alert {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.875rem 1rem;
        background: color-mix(in srgb, var(--color-danger) 10%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
        border-radius: 8px;
      }
      .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .error-icon { font-size: 1.125rem; line-height: 1; flex-shrink: 0; }
      .error-message { margin: 0; font-size: 0.875rem; color: var(--color-danger); }
    `,
  ],
})
export class ErrorAlertComponent {
  readonly message = input('Something went wrong');
  readonly retry = output<void>();
}
