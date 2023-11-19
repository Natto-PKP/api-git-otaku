import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { UserModel } from '../../models/User/UserModel';
import BasicError from '../../errors/BasicError';

// Types
export interface Payload {
  id: string;
  exp: number;
}

// Magic numbers
export const ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 3; // 3 minutes
export const REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 14; // 14 days

/**
 * Auth service
 */
export class AuthService {
  /**
   * Generate jwt access token
   * @param user
   * @returns
   */
  static async generateJwtAccessToken(user: UserModel) {
    const exp = Date.now() + ACCESS_TOKEN_EXPIRATION;
    const payload = { id: user.id, exp: exp / 1000 };

    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return token;
  }

  /**
   * Generate jwt refresh token
   * @param user
   * @returns
   */
  static async generateJwtRefreshToken(user: UserModel) {
    const exp = Date.now() + REFRESH_TOKEN_EXPIRATION; // 14 days
    const payload = { id: user.id, exp: exp / 1000 };

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!);

    return refreshToken;
  }

  /**
   * Verify jwt access token
   * @param accessToken
   * @param logit
   * @returns
   */
  static async verifyJwtAccessToken(accessToken: string, logit = false) {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    if (!decoded) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });
    return decoded as Payload;
  }

  /**
   * Verify jwt refresh token
   * @param refreshToken
   * @param logit
   * @returns
   */
  static async verifyJwtRefreshToken(refreshToken: string, logit = false) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    if (!decoded) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });
    return decoded as Payload;
  }

  /**
   * Compare passwords
   * @param password
   * @param hashedPassword
   * @returns
   */
  static async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
