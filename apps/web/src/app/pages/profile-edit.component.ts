import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../shared/toast.component';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Edit Profile</h1>
        <p class="page-subtitle">Update your personal information and how others see you.</p>
      </div>

      @if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      }

      <form (ngSubmit)="save()" class="profile-form">
        <div class="card form-card">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input id="name" class="input" [(ngModel)]="name" name="name" required placeholder="Your name" />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input id="email" class="input" [(ngModel)]="email" name="email" type="email" required placeholder="you@example.com" />
            <span class="form-hint">Email cannot be changed</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="bio">Bio</label>
            <textarea id="bio" class="input" [(ngModel)]="bio" name="bio" rows="4" placeholder="Tell others about yourself..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="photo">Photo URL</label>
            <input id="photo" class="input" [(ngModel)]="photoUrl" name="photoUrl" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label class="form-label" for="timezone">Timezone</label>
            <select id="timezone" class="input" [(ngModel)]="timezone" name="timezone">
              <option value="">Select timezone</option>
              <option value="America/New_York">Eastern (UTC-5)</option>
              <option value="America/Chicago">Central (UTC-6)</option>
              <option value="America/Denver">Mountain (UTC-7)</option>
              <option value="America/Los_Angeles">Pacific (UTC-8)</option>
              <option value="Europe/London">London (UTC+0)</option>
              <option value="Europe/Paris">Central Europe (UTC+1)</option>
              <option value="Europe/Berlin">Berlin (UTC+1)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
              <option value="Asia/Shanghai">Shanghai (UTC+8)</option>
              <option value="Australia/Sydney">Sydney (UTC+10)</option>
              <option value="Pacific/Auckland">Auckland (UTC+12)</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/dashboard" class="btn btn-ghost">Cancel</a>
          <button type="submit" class="btn btn-primary" [disabled]="saving()">
            {{ saving() ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page { max-width: 640px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .profile-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .form-hint { font-size: 0.75rem; color: var(--color-muted); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
    .alert-danger { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
  `],
})
export class ProfileEditComponent {
  private readonly userService = inject(UserService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected name = this.authService.currentUser()?.name || '';
  protected email = this.authService.currentUser()?.email || '';
  protected bio = this.authService.currentUser()?.bio || '';
  protected photoUrl = this.authService.currentUser()?.photoUrl || '';
  protected timezone = this.authService.currentUser()?.timezone || '';

  protected save(): void {
    if (!this.name.trim()) {
      this.error.set('Name is required');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.userService.updateProfile({
      name: this.name,
      bio: this.bio,
      photoUrl: this.photoUrl,
      timezone: this.timezone,
    }).subscribe({
      next: (user) => {
        this.authService.currentUser.set(user);
        this.saving.set(false);
        this.toast.success('Profile updated!');
        this.router.navigate(['/profile', user.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to update profile');
      },
    });
  }
}
