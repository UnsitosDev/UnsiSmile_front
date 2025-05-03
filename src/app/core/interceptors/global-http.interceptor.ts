import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { Messages } from 'src/app/utils/MessagesConstant';

export const globalHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const notif = inject(ToastrService);

  return next(req).pipe(
    // Reintentos para 5xx
    catchError((error: HttpErrorResponse) => {

      // Mapeo de estados
      if (error.status === 0) {
        notif.warning(Messages.ERROR_NETWORK);
      }

      return throwError(() => error);
    })
  );
};