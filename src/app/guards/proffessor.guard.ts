import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';
import { Router } from '@angular/router';
import { ROLES } from 'src/app/utils/roles';

export const proffesorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si existe un token en la sesión
  const token = authService.getToken();
  if (!token) {
     
    // Si no hay token, redirigir al login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Decodificar el token para obtener los datos del usuario, incluyendo el rol
  const tokenData = authService.getTokenDataUser(token);
  const userRole = tokenData?.role;  // Verifica que tokenData esté definido

  // Obtener el primer rol
  const role = userRole?.[0]?.authority;  // Uso de optional chaining para evitar errores

  // Verificar si el rol es de profesor
  if (role === ROLES.PROFESSOR) {
    return true;
  }

  // Si no está autenticado, redirigir al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
