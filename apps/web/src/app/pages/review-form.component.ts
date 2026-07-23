import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../services/review.service';
import { ExchangeService } from '../services/exchange.service';
import { AuthService } from '../services/auth.service';
import { Exchange } from '../models';
import { StarRatingComponent } from '../shared/star-rating.component';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [RouterLink, FormsModule, StarRatingComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <a [routerLink]="['/exchanges', exchangeId]" class="btn btn-ghost btn-sm">← Back</a>
        <h1 class="page-title">Leave a Review</h1>
        <p class="page-subtitle">Share your experience with this skill exchange.</p>
      </div>

      @if (loading()) {
        <div class="card"><p class="text-muted">Loading...</p></div>
      } @else if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      } @else {
        <div class="card review-card">
          @if (exchange(); as ex) {
            <div class="review-partner">
              <span class="review-label">Reviewing your exchange with</span>
              <span class="partner-name">{{ otherUserName(ex) }}</span>
            </div>
          }

          <div class="rating-section">
            <span class="rating-label">Rating</span>
            <app-star-rating
              [rating]="rating"
              [interactive]="true"
              size="lg"
              (ratingChange)="rating = $event"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="comment">Comment (optional)</label>
            <textarea
              id="comment"
              class="input"
              [(ngModel)]="comment"
              name="comment"
              rows="4"
              placeholder="What was your experience like? Any highlights or suggestions?"
            ></textarea>
          </div>

          <div class="form-actions">
            <a [routerLink]="['/dashboard']" class="btn btn-ghost">Skip</a>
            <button
              class="btn btn-primary"
              [disabled]="submitting() || rating === 0"
              (click)="submit()"
            >
              {{ submitting() ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 540px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header .btn { margin-bottom: 0.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .review-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .review-partner { display: flex; flex-direction: column; gap: 0.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }
    .review-label { font-size: 0.8125rem; color: var(--color-muted); }
    .partner-name { font-size: 1.125rem; font-weight: 600; color: var(--color-ink); }
    .rating-section { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; padding: 1rem 0; }
    .rating-label { font-size: 0.875rem; font-weight: 600; color: var(--color-ink); }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.5rem; }
    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; }
    .alert-danger { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .text-muted { color: var(--color-muted); font-size: 0.875rem; margin: 0; }
  `],
})
export class ReviewFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reviewService = inject(ReviewService);
  private readonly exchangeService = inject(ExchangeService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly exchangeId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly exchange = signal<Exchange | null>(null);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected rating = 0;
  protected comment = '';

  constructor() {
    if (!this.exchangeId) { this.error.set('Exchange not found'); this.loading.set(false); return; }
    this.exchangeService.getById(this.exchangeId).subscribe({
      next: (ex) => { this.exchange.set(ex); this.loading.set(false); },
      error: () => { this.error.set('Exchange not found'); this.loading.set(false); },
    });
  }

  protected otherUserName(ex: Exchange): string {
    const userId = this.authService.currentUser()?.id;
    if (ex.senderId === userId) return ex.receiver?.name ?? 'the other user';
    return ex.sender?.name ?? 'the other user';
  }

  protected submit(): void {
    if (this.rating === 0) return;

    this.submitting.set(true);
    this.error.set('');

    const exchange = this.exchange();
    if (!exchange) return;

    const userId = this.authService.currentUser()?.id;
    const targetId = exchange.senderId === userId ? exchange.receiverId : exchange.senderId;

    this.reviewService.create(this.exchangeId, {
      rating: this.rating,
      comment: this.text || undefined,
      targetId: targetId,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Review submitted!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Failed to submit review');
      },
    });
  }
}
