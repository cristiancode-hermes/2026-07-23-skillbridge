import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card auth-card">
      <h2 class="card-title">Create your account</h2>
      <p class="card-subtitle">Join SkillBridge and start exchanging skills.</p>

      @if (error) {
        <div class="alert alert-danger">{{ error }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="name">Full Name</label>
          <input
            id="name"
            type="text"
            class="input"
            [(ngModel)]="name"
            name="name"
            required
            autocomplete="name"
            placeholder="Jane Doe"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input
            id="email"
            type="email"
            class="input"
            [(ngModel)]="email"
            name="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            type="password"
            class="input"
            [(ngModel)]="password"
            name="password"
            required
            autocomplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>

        <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account? <a routerLink="/login">Sign in</a>
      </p>
    </div>
  `,
  styles: [
    `
      .auth-card { padding: 2rem; }
      .card-title { margin: 0 0 0.25rem; font-size: 1.375rem; font-weight: 700; }
      .card-subtitle { margin: 0 0 1.5rem; font-size: 0.875rem; color: var(--color-muted); }
      .auth-form { display: flex; flex-direction: column; gap: 1rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
      .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
      .auth-footer { text-align: center; margin: 1.25rem 0 0; font-size: 0.875rem; color: var(--color-muted); }
      .auth-footer a { color: var(--color-primary); text-decoration: none; font-weight: 600; }
      .auth-footer a:hover { text-decoration: underline; }
      .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
      .alert-danger { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    `,
  ],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected name = '';
  protected email = '';
  protected password = '';
  protected loading = false;
  protected error = '';

  protected onSubmit(): void {
    if (!this.name || !this.email || !this.password) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/onboarding']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      },
    });
  }
}
