import { Injectable } from '@angular/core';
import { AuthModel } from '../models/core/auth.model';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  saveToSession(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  readFromSession(key: string): AuthModel.UserTokenData {
    return this.getTokenData(sessionStorage.getItem(key) || '');
  }

  private getTokenData(token: string): AuthModel.UserTokenData {
    return token ? jwtDecode(token) : AuthModel.userTokenData;
  }

  /**
   * Redirige al usuario según su rol obtenido del token.
   *
   * @param {string} role - El rol del usuario.
   */

  redirectByRole(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      ROLE_STUDENT: '/students/dashboard',
    };
    const route = roleRoutes[role];

    if (route) {
      this.router.navigate([route]);
    } else {
      this.router.navigateByUrl('');
    }
  }

  /**
   * Decodificar el token y obtener los datos asociados.
   *
   * @param {string} token - El token JWT a decodificar.
   * @returns {any} - Objeto con los datos decodificados del token.
   */

  getTokenDataUser(token: string): any {
    return token
      ? jwtDecode(token)
      : {
          exp: 0,
          iat: 0,
          role: [
            {
              authority: '',
            },
          ],
          sub: '',
          uuid: '',
        };
  }
}
