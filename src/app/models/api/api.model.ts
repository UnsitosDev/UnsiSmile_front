export namespace ApiModel {
  export interface ReqParams {
      params?: any;
      headers?:any,
      url: string,
      data?: any,
  }

  export interface ResponseParams<T> {
      response: T
      
  }

}
