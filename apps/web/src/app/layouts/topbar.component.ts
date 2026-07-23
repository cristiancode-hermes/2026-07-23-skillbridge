import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AvatarComponent } from '../shared/avatar.component';
import { SearchInputComponent } from '../shared/search-input.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, AvatarComponent, SearchInputComponent],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <a routerLink="/dashboard" class="topbar-logo">SkillBridge</a>
        <app-search-input
          placeholder="Search skills..."
          class="topbar-search"
          (search)="onSearch($event)"
        />
      </div>

      <div class="topbar-right">
        <button class="theme-toggle" (click)="themeService.toggle()" title="Toggle theme">
          @if (themeService.darkMode()) { ☀️ } @else { 🌙 }
        </button>

        <div class="user-menu" (click)="menuOpen = !menuOpen" (clickOutside)="menuOpen = false">
          <app-avatar [user]="{ name: currentUser()?.name, photoUrl: currentUser()?.photoUrl }" size="sm" />
          <div class="dropdown-menu" [class.open]="menuOpen">
            <a routerLink="/dashboard" class="dropdown-item">Dashboard</a>
            <a [routerLink]="['/profile', currentUser()?.id]" class="dropdown-item">My Profile</a>
            <a routerLink="/profile/edit" class="dropdown-item">Edit Profile</a>
            <a routerLink="/settings" class="dropdown-item">Settings</a>
            <hr class="dropdown-divider" />
            <button class="dropdown-item dropdown-logout" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 1.25rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .topbar-left { display: flex; align-items: center; gap: 1.5rem; flex: 1; }
      .topbar-right { display: flex; align-items: center; gap: 1rem; }
      .topbar-logo {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--color-primary);
        text-decoration: none;
        letter-spacing: -0.02em;
        white-space: nowrap;
      }
      .topbar-search { max-width: 280px; width: 100%; }
      .theme-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0.25rem;
        line-height: 1;
      }
      .user-menu {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        min-width: 180px;
        display: none;
        flex-direction: column;
        padding: 0.375rem;
        z-index: 200;
      }
      .dropdown-menu.open { display: flex; }
      .dropdown-item {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: var(--color-ink);
        text-decoration: none;
        border-radius: 6px;
        cursor: pointer;
        background: none;
        border: none;
        text-align: left;
        transition: background 0.15s;
      }
      .dropdown-item:hover { background: var(--color-surface-hover); }
      .dropdown-logout { color: var(--color-danger); }
      .dropdown-divider {
        margin: 0.25rem 0;
        border: none;
        border-top: 1px solid var(--color-border);
      }
    `,
  ],
})
export class TopbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected menuOpen = false;

  protected readonly currentUser = this.authService.currentUser;

  protected onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/skills'], { queryParams: { search: query } });
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
