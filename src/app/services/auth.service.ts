import { Injectable } from '@angular/core';
import { AuthModel } from '../models/core/auth.model';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  saveToSession(key: string, value: string) {
    sessionStorage.setItem(key,value);
  }

  readFromSession(key: string): AuthModel.UserTokenData{
    return this.getTokenData(sessionStorage.getItem(key) || '');
  }

  private getTokenData(token:string) :  AuthModel.UserTokenData{
    return token ? jwtDecode(token) : AuthModel.userTokenData;
  }

}
