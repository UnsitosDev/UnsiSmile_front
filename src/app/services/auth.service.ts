import { Injectable } from '@angular/core';
import { AuthModel } from '../models/core/auth.model';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { TokenData } from '../components/public/login/model/tokenData';
import { SessionStorageConstants } from '../utils/session.storage';

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
 * Obtiene el token de usuario almacenado en la sesión.
 *
 * @returns {string | null} El token de usuario almacenado en la sesión o null si no se encuentra.
 */
  getToken(): string | null {
    // Verifica si la ventana está definida para evitar errores en entornos sin ventana, como Node.js
    if (typeof window !== 'undefined') {
      // Obtiene el token de usuario de la sesión
      const token = sessionStorage.getItem(SessionStorageConstants.USER_TOKEN);
      return token;
    }
    return null;// Devuelve null si no se encuentra el token o no hay ventana definida
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
   * Decodifica el token JWT proporcionado y devuelve los datos asociados.
   *
   * @param {string} token - El token JWT a decodificar.
   * @returns {TokenData} - Objeto con los datos decodificados del token.
   */
  getTokenDataUser(token: string): TokenData {
    const tokenData: TokenData = jwtDecode(token);

    return tokenData;
  }
}
