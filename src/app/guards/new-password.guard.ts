import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@mean/services';
import { TokenData } from '../components/public/login/model/tokenData';
import { ROLES } from 'src/app/utils/roles';

@Injectable({
  providedIn: 'root',
})
export class NewPasswordGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['']);
      return false;
    }

    const tokenData: TokenData = this.authService.getTokenDataUser(token);
    if (!tokenData.firstLogin) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
