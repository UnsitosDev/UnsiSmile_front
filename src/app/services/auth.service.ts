import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UriConstants } from '@mean/utils';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { TokenData } from '../components/public/login/model/tokenData';
import { AuthModel } from '../models/core/auth.model';
import { TokenResponse } from '../models/core/TokenResponse';
import { SessionStorageConstants } from '../utils/session.storage';
import { ROLES } from '../utils/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}
  ROL = ROLES;
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
    return null; // Devuelve null si no se encuentra el token o no hay ventana definida
  }

  /**
   * Redirige al usuario según su rol obtenido del token.
   *
   * @param {string} role - El rol del usuario.
   */

  redirectByRole(role: string, returnUrl?: string): void {
    let route = '';
    if (role === 'ROLE_STUDENT') {
      route = returnUrl ? `/${returnUrl}` : '/students';
    } else if (role === 'ROLE_ADMIN') {
      route = returnUrl ? `/${returnUrl}` : '/admin';
    } else if (role === 'ROLE_PROFESSOR') {
      route = returnUrl ? `/${returnUrl}` : '/professor';
    } else if (role === this.ROL.CLINICAL_AREA_SUPERVISOR) {
      route = returnUrl ? `/${returnUrl}` : '/clinical-area-supervisor';
    }

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

  /**
   * Elimina los datos de la sesión del usuario.
   */
  clearSession(): void {
    sessionStorage.clear();
  }

  /**
   * Obtiene el token de refresco almacenado en la sesión.
   */
  getRefreshToken(): string {
    return sessionStorage.getItem(SessionStorageConstants.USER_REFRESH_TOKEN) || '';
  }

  /**
   * Realiza una petición para refrescar el token.
   * Se asumirá que el endpoint de refresco es POST y que espera un objeto con la propiedad refreshToken.
   */
  refreshToken(): Observable<TokenResponse> {
    const oldRefreshToken: string | null = this.getRefreshToken();
    sessionStorage.removeItem(SessionStorageConstants.USER_TOKEN);
    const url = `${UriConstants.REFRESH_TOKEN_ENDPOINT}`; // Ajusta esta URL según tu API
    return this.http.post<TokenResponse>(url, { "refreshToken": oldRefreshToken });
  }
}   
