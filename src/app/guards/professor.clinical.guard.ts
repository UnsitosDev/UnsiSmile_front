import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mean/services';
import { Router } from '@angular/router';
import { ROLES } from '../utils/roles';

export const professorClinicalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ROL = ROLES;

  const token = authService.getToken();
  if (!token) {
     
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const tokenData = authService.getTokenDataUser(token);
  const userRole = tokenData?.role;  

  const role = userRole?.[0]?.authority; 

  if (role === ROL.PROFESSOR_CLINICAL_AREA) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
