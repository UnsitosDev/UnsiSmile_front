import { isDevMode } from '@angular/core';

const host = isDevMode() ? 'http://localhost:8080' : 'otherdomain.com';
const basePath = host;
export class UriConstants {
  public static readonly HOST = host;
  public static readonly MESSAGES = basePath + '/messages';
  public static readonly USER_LOGIN = basePath + '/auth/login';
  public static readonly USER_REGISTER = basePath + '/auth/register';

}
