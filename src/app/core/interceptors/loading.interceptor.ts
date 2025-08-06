import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show(); // Activa el estado de carga

  return next(req).pipe(
    finalize(() => loadingService.hide()) // Desactiva el estado de carga al finalizar
  );
};
