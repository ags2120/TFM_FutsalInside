import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Central 401 handling: a rejected request while a session is open means the
 * token expired or was revoked server-side, so the local session is dropped
 * and the user is sent to login with a `returnUrl`.
 *
 * A 401 from the login/register endpoints themselves is exempt (the form
 * shows the credential error instead of bouncing the user), as is any
 * request made without a session in the first place.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // TODO: Implementar toast/notification service
      console.error('HTTP Error:', error.status, error.message);

      if (error.status === 401 && auth.isAuthenticated()) {
        auth.clearSession();

        const current = router.url;
        const onAuthPage = current.startsWith('/login') || current.startsWith('/register');
        if (!onAuthPage) {
          router.navigate(['/login'], { queryParams: { returnUrl: current } });
        }
      }

      return throwError(() => error);
    })
  );
};
