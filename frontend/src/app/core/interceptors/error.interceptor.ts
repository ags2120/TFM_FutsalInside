import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // TODO: Implementar toast/notification service
      console.error('HTTP Error:', error.status, error.message);

      if (error.status === 401) {
        // TODO: Redirect to login or refresh token
      }

      return throwError(() => error);
    })
  );
};
