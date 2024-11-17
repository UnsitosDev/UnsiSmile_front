import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiModel } from '@mean/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService<GET = {}, POST = {}, PUT = {}, PATCH = {}, DELETE = {}> {
  constructor(private http: HttpClient) {}

  /** Para realizar las peticiones GET */
  getService(reqParams: ApiModel.ReqParams): Observable< GET> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
      responseType: reqParams.responseType || 'json'
    };
    return this.http.get<GET>(reqParams.url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getListService(reqParams: ApiModel.ReqParams): Observable< GET[]> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.get<GET[]>(reqParams.url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }


  /** Para realizar las peticiones POST */
  postService(reqParams: ApiModel.ReqParams): Observable<POST> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.post<POST>(reqParams.url, reqParams.data, options ).pipe(  
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /** Para realizar las peticiones DELETE*/
  deleteService(reqParams: ApiModel.ReqParams): Observable<DELETE> {
    const options = {
      body: reqParams.data,
      params: reqParams.params,
    };
    return this.http.delete<DELETE>(reqParams.url, options).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }

}
