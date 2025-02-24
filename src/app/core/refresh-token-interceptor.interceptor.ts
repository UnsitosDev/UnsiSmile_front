import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';
import { throwError } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';
import { SessionStorageConstants } from './../utils/session.storage';
import { TokenResponse } from '../models/core/TokenResponse';

export const RefreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let authReq = req;
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos 403 (o 401, según tu API) y no es el endpoint de refresh, intentamos refrescar
      if (error.status === 403 && !req.url.includes('refresh')) {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((newTokenResponse: TokenResponse) => {
              // Actualizamos el token en sessionStorage
              sessionStorage.setItem(SessionStorageConstants.USER_TOKEN, newTokenResponse.token);
              sessionStorage.setItem(SessionStorageConstants.USER_REFRESH_TOKEN, newTokenResponse.refreshToken);
              // Clonamos la petición original con el nuevo token
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokenResponse.token}`,
                },
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              // En caso de error al refrescar se limpia la sesión y se propaga el error
              sessionStorage.clear();
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
