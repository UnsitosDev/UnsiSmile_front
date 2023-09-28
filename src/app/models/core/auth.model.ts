export namespace AuthModel {
  export interface UserTokenData {
    tokenType: 'refresh' | 'token' | 'bareer' | "";
  }

  export interface UserLogin {
    user: string;
    password:  string;
    role:      'role_admin' | 'role_user' | '';
}

  export const userTokenData: UserTokenData = {
    tokenType: ''
  }
}
