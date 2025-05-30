export interface JwtPayload {
  sub: string;
  id: number;
  roles: string[];
  iat: number;
  exp: number;
}
