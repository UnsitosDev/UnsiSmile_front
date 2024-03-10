export interface TokenData {
  exp: number;
  iat: number;
  role: { authority: string }[];
  sub: string;
  uuid: string;
}
