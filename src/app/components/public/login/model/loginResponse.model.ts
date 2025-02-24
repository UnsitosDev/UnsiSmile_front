//interfaces para las repuestas del login
export type Get = {}

export type PostLogin = {
  response : {
    token : string;
    refreshToken : string;
  }
}
