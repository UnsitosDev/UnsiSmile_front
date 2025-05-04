import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';
import { Router } from '@angular/router';
import { ROLES } from 'src/app/utils/roles';

export const clinicalAreaSupervisorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si existe un token en la sesión
  const token = authService.getToken();
  if (!token) {
    // Si no hay token, redirigir al login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Decodificar el token para obtener los datos del usuario
  const tokenData = authService.getTokenDataUser(token);
  const userRole = tokenData?.role;
  
  // Obtener el primer rol
  const role = userRole?.[0]?.authority;
  
  // Verificar si el rol es de supervisor de área clínica
  if (role === ROLES.CLINICAL_AREA_SUPERVISOR) {
    return true;
  }

  // Si no tiene el rol adecuado, redirigir al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
