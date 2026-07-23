import { Component, input, output, signal, DestroyRef, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="input search-input"
        [placeholder]="placeholder()"
        [(ngModel)]="query"
        (input)="onInput()"
      />
      @if (query()) {
        <button class="search-clear" (click)="clear()">✕</button>
      }
    </div>
  `,
  styles: [
    `
      .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      .search-icon {
        position: absolute;
        left: 0.75rem;
        font-size: 0.875rem;
        pointer-events: none;
      }
      .search-input {
        padding-left: 2.25rem;
        padding-right: 2.25rem;
        width: 100%;
      }
      .search-clear {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-muted);
        font-size: 0.875rem;
        padding: 0.25rem;
        line-height: 1;
      }
      .search-clear:hover { color: var(--color-ink); }
    `,
  ],
})
export class SearchInputComponent {
  readonly placeholder = input('Search...');
  readonly search = output<string>();

  protected readonly query = signal('');
  private debounceTimer?: ReturnType<typeof setTimeout>;

  protected onInput(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.search.emit(this.query());
    }, 300);
  }

  protected clear(): void {
    this.query.set('');
    this.search.emit('');
  }
}
