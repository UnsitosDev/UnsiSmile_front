import { CanActivateFn } from '@angular/router';
import {  Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si existe un token en la sesión
  const token = authService.getToken();

  if (token) {
    // El usuario está autenticado (hay un token), permitir acceso
    return true;
  } else {
    // Si no está autenticado, redirigir al login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};



