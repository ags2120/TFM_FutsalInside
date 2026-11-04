import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Append the attempted URL as `returnUrl` so the login page can send the
 * user back where they were headed after authenticating.
 *
 * Only same-app paths are honoured: an absolute URL (`https://…`) or a
 * protocol-relative one (`//…`) would turn the redirect into an open
 * redirect, so anything not starting with a single `/` falls back to home.
 */
function loginUrlTree(router: Router, returnUrl: string | null): UrlTree {
  const safe =
    returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : null;

  return router.createUrlTree(['/login'], {
    queryParams: safe ? { returnUrl: safe } : {},
  });
}

/** Blocks anonymous users; preserves the destination for post-login return. */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return loginUrlTree(router, state.url);
};

/** Keeps signed-in users off the login/register pages. */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
