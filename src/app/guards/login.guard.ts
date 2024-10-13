import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si existe un token en la sesión
  const token = authService.getToken();

  if (token) {
    // Si el usuario ya está logueado, redirigir a una página protegida (como el dashboard o students)
    router.navigate(['/students']);
    return false; // No permitir acceso a la página de login
  } else {
    // Si no está logueado, permitir acceso a la página de login
    return true;
  }
};
