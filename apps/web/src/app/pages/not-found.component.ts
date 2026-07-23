import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1 class="not-found-code">404</h1>
      <p class="not-found-text">Page not found</p>
      <a routerLink="/" class="btn btn-primary">Go Home</a>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        padding: 2rem;
      }
      .not-found-code {
        font-size: 5rem;
        font-weight: 800;
        color: var(--color-primary);
        margin: 0;
        line-height: 1;
      }
      .not-found-text {
        font-size: 1.125rem;
        color: var(--color-muted);
        margin: 0.5rem 0 1.5rem;
      }
    `,
  ],
})
export class NotFoundComponent {}
