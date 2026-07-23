import { Component, input, computed } from '@angular/core';

const STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  active: 'primary',
  completed: 'success',
  cancelled: 'danger',
  declined: 'danger',
  confirmed: 'primary',
  scheduled: 'primary',
  rescheduled: 'warning',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="status-badge status-{{ color() }}">
      {{ status() }}
    </span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.625rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
        white-space: nowrap;
      }
      .status-primary { background: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary); }
      .status-success { background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success); }
      .status-warning { background: color-mix(in srgb, var(--color-warning) 15%, transparent); color: var(--color-warning); }
      .status-danger  { background: color-mix(in srgb, var(--color-danger) 15%, transparent); color: var(--color-danger); }
    `,
  ],
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  protected readonly color = computed(() => {
    return STATUS_COLORS[this.status().toLowerCase()] ?? 'primary';
  });
}
