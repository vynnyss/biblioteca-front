/**
 * Interface gerada para mapear o payload do token JWT
 * Exemplo de JSON:
 * {
 *   "iss": "auth-api",
 *   "sub": "teste@test.com",
 *   "role": "CLIENTE",
 *   "exp": 1761768804
 * }
 */
export interface DecodeToken {
  iss: string;
  sub: string;
  role: string;
  exp: number;
}
