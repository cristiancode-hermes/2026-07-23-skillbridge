import { Component, input } from '@angular/core';

export interface BadgeSkill {
  name: string;
  emoji?: string;
}

@Component({
  selector: 'app-skill-badge',
  standalone: true,
  template: `
    <span class="skill-badge skill-badge-{{ type() }}">
      @if (skill().emoji) {
        <span class="skill-emoji">{{ skill().emoji }}</span>
      }
      {{ skill().name }}
    </span>
  `,
  styles: [
    `
      .skill-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 500;
        white-space: nowrap;
      }
      .skill-badge-offering {
        background: var(--color-primary);
        color: #fff;
      }
      .skill-badge-seeking {
        background: var(--color-secondary);
        color: #fff;
      }
      .skill-emoji {
        font-size: 1em;
        line-height: 1;
      }
    `,
  ],
})
export class SkillBadgeComponent {
  readonly skill = input.required<BadgeSkill>();
  readonly type = input<'offering' | 'seeking'>('offering');
}
