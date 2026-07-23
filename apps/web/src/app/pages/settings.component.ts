import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account preferences and settings.</p>
      </div>

      <section class="settings-section">
        <h2 class="section-title">Appearance</h2>
        <div class="card settings-card">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Dark Mode</span>
              <span class="setting-desc">Toggle between light and dark theme.</span>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                [checked]="themeService.darkMode()"
                (change)="themeService.toggle()"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <section class="settings-section">
        <h2 class="section-title">Account</h2>
        <div class="card settings-card">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Edit Profile</span>
              <span class="setting-desc">Update your name, bio, and photo.</span>
            </div>
            <a routerLink="/profile/edit" class="btn btn-outline btn-sm">Edit</a>
          </div>

          <hr class="divider" />

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Account Email</span>
              <span class="setting-desc">{{ currentUser()?.email }}</span>
            </div>
            <span class="setting-badge">Verified</span>
          </div>
        </div>
      </section>

      <section class="settings-section">
        <h2 class="section-title section-title-danger">Danger Zone</h2>
        <div class="card settings-card settings-card-danger">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Delete Account</span>
              <span class="setting-desc">
                Permanently delete your account and all data. This action cannot be undone.
              </span>
            </div>
            <button class="btn btn-danger btn-sm" (click)="showDeleteConfirm.set(true)">
              Delete Account
            </button>
          </div>
        </div>
      </section>

      @if (showDeleteConfirm()) {
        <app-confirm-dialog
          title="Delete Account"
          message="Are you sure you want to delete your account? All your data, exchanges, and reviews will be permanently removed."
          confirmText="Delete Forever"
          variant="danger"
          (confirm)="deleteAccount()"
          (cancel)="showDeleteConfirm.set(false)"
        />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 640px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .settings-section { margin-bottom: 2rem; }
    .section-title { font-size: 1rem; font-weight: 700; margin: 0 0 0.75rem; color: var(--color-ink); }
    .section-title-danger { color: var(--color-danger); }
    .settings-card { padding: 1.25rem; }
    .settings-card-danger { border-color: color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .setting-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .setting-info { display: flex; flex-direction: column; gap: 0.125rem; }
    .setting-label { font-size: 0.9375rem; font-weight: 600; color: var(--color-ink); }
    .setting-desc { font-size: 0.8125rem; color: var(--color-muted); }
    .setting-badge { font-size: 0.75rem; color: var(--color-success); font-weight: 600; background: var(--color-success-light); padding: 0.125rem 0.5rem; border-radius: 999px; }
    .divider { border: none; border-top: 1px solid var(--color-border); margin: 1rem 0; }
    .toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute; cursor: pointer; inset: 0;
      background: var(--color-border); border-radius: 24px; transition: 0.2s;
    }
    .toggle-slider::before {
      content: ''; position: absolute; left: 3px; top: 3px;
      width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: 0.2s;
    }
    .toggle input:checked + .toggle-slider { background: var(--color-primary); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }
  `],
})
export class SettingsComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly showDeleteConfirm = signal(false);

  protected deleteAccount(): void {
    this.showDeleteConfirm.set(false);
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.toast.info('Account deleted');
        this.router.navigate(['/']);
      },
      error: () => this.toast.error('Failed to delete account'),
    });
  }
}
