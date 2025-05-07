import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiModel } from '@mean/models';
import { Messages } from '../utils/MessagesConstant';

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
    const enhancedError = {
      message: error.error?.message || Messages.ERROR,
      status: error.status,
      originalError: error
    };

    return throwError(() => enhancedError);
  }
  
  /** Para realizar las peticiones PATCH */
  patchService(reqParams: ApiModel.ReqParams): Observable<PATCH> {
    const options = {
      params: reqParams.params ? reqParams.params : {}
    };
    return this.http.patch<PATCH>(reqParams.url, reqParams.data, options).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /** Para realizar las peticiones PUT */
  putService(reqParams: ApiModel.ReqParams): Observable<PUT> {
    const options = {
      params: reqParams.params ? reqParams.params : {}
    };
    return this.http.put<PUT>(reqParams.url, reqParams.data, options).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }
}
