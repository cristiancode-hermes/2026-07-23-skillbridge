import { inject } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Redirects authenticated users away from auth pages (login, register).
 * Uses auth layout (centered card, no topbar).
 */
export function authLayoutGuard(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.parseUrl('/dashboard');
  }

  return true;
}
