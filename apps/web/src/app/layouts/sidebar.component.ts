import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <button class="sidebar-toggle" (click)="collapsed.set(!collapsed())">
        {{ collapsed() ? '→' : '←' }}
      </button>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
          <span class="sidebar-icon">📊</span>
          @if (!collapsed()) { <span>Dashboard</span> }
        </a>
        <a routerLink="/skills" routerLinkActive="active" class="sidebar-link">
          <span class="sidebar-icon">🔍</span>
          @if (!collapsed()) { <span>Browse Skills</span> }
        </a>
        <a [routerLink]="['/profile', 0]" routerLinkActive="active" class="sidebar-link">
          <span class="sidebar-icon">👤</span>
          @if (!collapsed()) { <span>Profile</span> }
        </a>
        <a routerLink="/profile/edit" routerLinkActive="active" class="sidebar-link">
          <span class="sidebar-icon">✏️</span>
          @if (!collapsed()) { <span>Edit Profile</span> }
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="sidebar-link">
          <span class="sidebar-icon">⚙️</span>
          @if (!collapsed()) { <span>Settings</span> }
        </a>
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 200px;
        background: var(--color-surface);
        border-right: 1px solid var(--color-border);
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: width 0.2s ease;
        flex-shrink: 0;
      }
      .sidebar.collapsed { width: 56px; }
      .sidebar-toggle {
        align-self: flex-end;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        color: var(--color-muted);
        padding: 0.25rem;
      }
      .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
      .sidebar-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.875rem;
        color: var(--color-ink);
        text-decoration: none;
        transition: background 0.15s;
      }
      .sidebar-link:hover { background: var(--color-surface-hover); }
      .sidebar-link.active { background: color-mix(in srgb, var(--color-primary) 10%, transparent); color: var(--color-primary); font-weight: 600; }
      .sidebar-icon { font-size: 1.125rem; line-height: 1; flex-shrink: 0; }
    `,
  ],
})
export class SidebarComponent {
  protected readonly collapsed = signal(false);
}
