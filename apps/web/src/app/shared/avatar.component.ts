import { Component, computed, input } from '@angular/core';

export interface AvatarUser {
  name?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (photoUrl(); as url) {
      <img
        class="avatar avatar-{{ size() }}"
        [src]="url"
        [alt]="user()?.name ?? 'User avatar'"
      />
    } @else {
      <div class="avatar avatar-{{ size() }} avatar-fallback" [title]="user()?.name ?? ''">
        {{ initials() }}
      </div>
    }
  `,
  styles: [`
    .avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0; overflow: hidden; object-fit: cover; background: var(--color-primary); }
    .avatar-sm { width: 32px; height: 32px; font-size: 0.75rem; }
    .avatar-md { width: 40px; height: 40px; font-size: 0.875rem; }
    .avatar-lg { width: 56px; height: 56px; font-size: 1.125rem; }
    .avatar-fallback { color: #fff; font-weight: 600; }
    img.avatar { background: var(--color-surface); }
  `],
})
export class AvatarComponent {
  readonly user = input<AvatarUser | null>(null);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly initials = computed(() => {
    const name = this.user()?.name ?? '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return '?';
  });

  protected readonly photoUrl = computed(() => {
    return this.user()?.photoUrl ?? null;
  });
}
