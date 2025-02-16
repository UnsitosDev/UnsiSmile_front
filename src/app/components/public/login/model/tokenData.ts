export interface TokenData {
  firstLogin: boolean;
  exp: number;
  iat: number;
  role: { authority: string }[];
  sub: string;
  uuid: string;
}
