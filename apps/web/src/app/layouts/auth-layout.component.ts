import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '../shared/toast.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-brand">
          <h1 class="auth-logo">SkillBridge</h1>
          <p class="auth-tagline">Connect. Learn. Grow.</p>
        </div>
        <router-outlet />
      </div>
      <app-toast-container />
    </div>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-bg);
        padding: 1.5rem;
      }
      .auth-container {
        width: 100%;
        max-width: 420px;
      }
      .auth-brand {
        text-align: center;
        margin-bottom: 2rem;
      }
      .auth-logo {
        font-size: 2rem;
        font-weight: 800;
        color: var(--color-primary);
        margin: 0;
        letter-spacing: -0.02em;
      }
      .auth-tagline {
        font-size: 0.9375rem;
        color: var(--color-muted);
        margin: 0.25rem 0 0;
      }
    `,
  ],
})
export class AuthLayoutComponent {}
