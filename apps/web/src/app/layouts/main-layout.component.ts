import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { ToastContainerComponent } from '../shared/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, ToastContainerComponent],
  template: `
    <div class="main-layout">
      <app-topbar />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-toast-container />
    </div>
  `,
  styles: [
    `
      .main-layout {
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
      }
      .main-content {
        flex: 1;
        padding: 1.5rem;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
      }
    `,
  ],
})
export class MainLayoutComponent {}
