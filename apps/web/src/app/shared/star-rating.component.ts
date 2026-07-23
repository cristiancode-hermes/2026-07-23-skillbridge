import { Component, input, output, computed, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating star-{{ size() }}" [class.interactive]="interactive()">
      @for (star of stars; track $index) {
        <span
          class="star"
          [class.filled]="$index < displayRating()"
          [class.hovered]="interactive() && $index < hoverIndex()"
          (mouseenter)="interactive() && hoverIndex.set($index + 1)"
          (mouseleave)="interactive() && hoverIndex.set(0)"
          (click)="interactive() && setRating($index + 1)"
        >
          ★
        </span>
      }
      @if (showRating()) {
        <span class="rating-text">{{ displayRating() }}/5</span>
      }
    </div>
  `,
  styles: [
    `
      .star-rating { display: inline-flex; align-items: center; gap: 2px; }
      .star {
        cursor: default;
        color: var(--color-border);
        transition: color 0.15s ease;
        user-select: none;
      }
      .interactive .star { cursor: pointer; }
      .star.filled, .star.hovered { color: var(--color-accent); }
      .rating-text {
        margin-left: 0.375rem;
        font-size: 0.8125rem;
        color: var(--color-muted);
      }
      .star-sm .star { font-size: 1rem; }
      .star-md .star { font-size: 1.25rem; }
      .star-lg .star { font-size: 1.5rem; }
    `,
  ],
})
export class StarRatingComponent {
  readonly rating = input<number>(0);
  readonly interactive = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ratingChange = output<number>();

  protected readonly hoverIndex = signal(0);

  protected stars = [0, 1, 2, 3, 4];

  protected showRating = computed(() => this.rating() > 0);

  protected displayRating = computed(() => {
    const hover = this.hoverIndex();
    return hover > 0 ? hover : this.rating();
  });

  protected setRating(value: number): void {
    this.ratingChange.emit(value);
  }
}
