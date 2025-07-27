import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@mean/services';
import { ROLES } from 'src/app/utils/roles';

export const MedicalRecordDigitizer: CanActivateFn = (state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {     
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const tokenData = authService.getTokenDataUser(token);
  const userRole = tokenData?.role;
  const role = userRole?.[0]?.authority;

  if (role === ROLES.ROLE_MEDICAL_RECORD_DIGITIZER) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
