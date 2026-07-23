import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-overlay" (click)="cancel.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <h3 class="dialog-title">{{ title() }}</h3>
        <p class="dialog-message">{{ message() }}</p>
        <div class="dialog-actions">
          <button class="btn btn-outline" (click)="cancel.emit()">Cancel</button>
          <button
            class="btn"
            [class.btn-primary]="variant() === 'primary'"
            [class.btn-danger]="variant() === 'danger'"
            (click)="confirm.emit()"
          >
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
      }
      .dialog-card {
        background: var(--color-bg);
        border-radius: 12px;
        padding: 1.5rem;
        max-width: 420px;
        width: 100%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }
      .dialog-title { margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 700; color: var(--color-ink); }
      .dialog-message { margin: 0 0 1.25rem; font-size: 0.875rem; color: var(--color-muted); line-height: 1.5; }
      .dialog-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
    `,
  ],
})
export class ConfirmDialogComponent {
  readonly title = input('Confirm');
  readonly message = input('Are you sure?');
  readonly confirmText = input('Confirm');
  readonly variant = input<'primary' | 'danger'>('primary');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
