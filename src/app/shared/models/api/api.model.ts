export namespace ApiModel {
  export interface ReqParams {
      params?: any;
      headers?:any,
      url: string,
      data?: any,
      responseType?: any; // responseType para peticiones específicas como Blob

  }

  export interface ResponseParams<T> {
      response: T
      
  }

}
