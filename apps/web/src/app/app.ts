import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class.dark]="themeService.darkMode()">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class App {
  protected readonly themeService = inject(ThemeService);
}
