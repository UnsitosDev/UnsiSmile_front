import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services'; // Asegúrate de que la ruta del servicio sea correcta
import { ROLES } from 'src/app/utils/roles';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si existe un token en la sesión
  const token = authService.getToken();

  if (token) {
    // Decodificar el token para obtener los datos del usuario, incluyendo el rol
    const tokenData = authService.getTokenDataUser(token);
    const userRole = tokenData.role; // Asumiendo que esto es un array de objetos [{ authority: 'ROLE_STUDENT' }]

    // Obtener el primer rol
    const role = userRole[0]?.authority;
    // Redirigir según el rol del usuario
    switch (role) {
      case ROLES.ADMIN:
        router.navigate(['/admin']);
        break;
      case ROLES.STUDENT:
        router.navigate(['/students']);
        break;
      case ROLES.PROFESSOR:
        router.navigate(['/professor']);
        break;
      case ROLES.CLINICAL_AREA_SUPERVISOR:
        router.navigate(['/clinical-area-supervisor']);
        break;
      default:
        router.navigate(['/']); // Ruta por defecto si el rol no es reconocido
        break;
    }

    return false; // No permitir acceso a la página de login si ya está autenticado
  } else {
    // Si no está logueado, permitir acceso a la página de login
    return true;
  }
};
