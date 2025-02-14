import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@mean/services';
import { TokenData } from '../components/public/login/model/tokenData';

@Injectable({
  providedIn: 'root',
})
export class PasswordChangeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      const tokenData: TokenData = this.authService.getTokenDataUser(token);
      if (tokenData.firstLogin) {
        this.router.navigate(['/new-password']);
        return false;
      }
    }
    return true;
  }
}
