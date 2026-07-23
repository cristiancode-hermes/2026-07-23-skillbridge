import { inject } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Ensures authenticated routes use the main layout (topbar + content).
 * Individual routes also have authGuard for fine-grained protection.
 */
export function mainLayoutGuard(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Allow access to main-layout routes, authGuard on child routes handles
  // the actual protection. This guard just sets the layout context.
  // If not authenticated, the child authGuard will redirect.
  return true;
}
