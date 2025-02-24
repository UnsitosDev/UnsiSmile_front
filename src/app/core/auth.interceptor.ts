import {
  HttpInterceptorFn
} from '@angular/common/http';
import { SessionStorageConstants } from '../utils/session.storage';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  let token = sessionStorage.getItem(SessionStorageConstants.USER_TOKEN);
  if (token) {
    const cloneRequest = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
      return next(cloneRequest);

  }
    
  return next(req);
};
