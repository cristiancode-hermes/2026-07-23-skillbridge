import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authLayoutGuard } from './guards/auth-layout.guard';
import { mainLayoutGuard } from './guards/main-layout.guard';

export const routes: Routes = [
  // ── Landing (no auth, auth layout) ──
  {
    path: '',
    canActivate: [authLayoutGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing.component').then(
            (m) => m.LandingComponent
          ),
      },
    ],
  },

  // ── Auth pages (no auth, auth layout) ──
  {
    path: '',
    canActivate: [authLayoutGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },

  // ── Authenticated pages (main layout) ──
  {
    path: '',
    canActivate: [mainLayoutGuard],
    children: [
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./pages/onboarding.component').then(
            (m) => m.OnboardingComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./pages/browse-skills.component').then(
            (m) => m.BrowseSkillsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'skills/category/:slug',
        loadComponent: () =>
          import('./pages/browse-skills.component').then(
            (m) => m.BrowseSkillsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./pages/profile-public.component').then(
            (m) => m.ProfilePublicComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'profile/edit',
        loadComponent: () =>
          import('./pages/profile-edit.component').then(
            (m) => m.ProfileEditComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'exchanges/new/:skillId/:userId',
        loadComponent: () =>
          import('./pages/exchange-request.component').then(
            (m) => m.ExchangeRequestComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'exchanges/:id',
        loadComponent: () =>
          import('./pages/exchange-detail.component').then(
            (m) => m.ExchangeDetailComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'exchanges/:id/sessions/new',
        loadComponent: () =>
          import('./pages/session-form.component').then(
            (m) => m.SessionFormComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'exchanges/:id/sessions/:sessionId/edit',
        loadComponent: () =>
          import('./pages/session-form.component').then(
            (m) => m.SessionFormComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'exchanges/:id/review',
        loadComponent: () =>
          import('./pages/review-form.component').then(
            (m) => m.ReviewFormComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings.component').then(
            (m) => m.SettingsComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },

  // ── Not Found ──
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found.component').then((m) => m.NotFoundComponent),
  },
];
