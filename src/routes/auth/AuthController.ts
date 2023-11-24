import type { Request, Response } from 'express';
import { ACCESS_TOKEN_EXPIRATION, AuthService, REFRESH_TOKEN_EXPIRATION } from './AuthService';
import { UserService } from '../users/UserService';
import { AuthenticationError, BasicError } from '../../errors/BasicError';
import { UserSanctionService } from '../users/sanctions/UserSanctionService';

/**
 * Auth controller
 */
export class AuthController {
  /**
   * Login
   * @param req
   * @param res
   */
  static async login(req: Request, res: Response) {
    const { username, email, password } = req.body; // get username, email and password from body

    // get user by username or email
    const user = await UserService.getOneByUsernameOrEmail(username, email, { scope: 'system' });
    if (!user) {
      throw new BasicError(
        { code: 'INVALID_CREDENTIALS', status: 400, message: 'invalid credentials' },
        { logit: false },
      );
    }

    // check password
    const isPasswordValid = await AuthService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BasicError(
        { code: 'INVALID_CREDENTIALS', status: 400, message: 'invalid credentials' },
        { logit: false },
      );
    }

    // check if user is banned
    if (await UserSanctionService.isAlreadySanctioned(user.id, ['BAN', 'TEMP_BAN'])) {
      throw new BasicError({ code: 'BANNED', status: 403, message: 'you are banned' }, { logit: false });
    }

    // generate tokens
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    res
      .status(200) // send tokens
      .cookie('refreshToken', refreshToken, { httpOnly: true, /* secure: true, */ maxAge: REFRESH_TOKEN_EXPIRATION })
      .cookie('accessToken', accessToken, { httpOnly: true, /* secure: true, */ maxAge: ACCESS_TOKEN_EXPIRATION })
      .send();
  }

  /**
   * Register
   * @param req
   * @param res
   */
  static async register(req: Request, res: Response) {
    const { body } = req; // get body

    // check if user already exists
    const user = await UserService.getOneByUsernameOrEmail(body.username, body.email, { scope: 'system' });
    if (user) {
      throw new BasicError(
        { code: 'USER_ALREADY_EXISTS', status: 400, message: 'user already exists' },
        { logit: false },
      );
    }

    // create user
    const newUser = await UserService.createOne(body);

    // generate tokens
    const accessToken = await AuthService.generateJwtAccessToken(newUser);
    const refreshToken = await AuthService.generateJwtRefreshToken(newUser);

    res
      .status(201) // send tokens
      .cookie('refreshToken', refreshToken, { httpOnly: true, /* secure: true, */ maxAge: REFRESH_TOKEN_EXPIRATION })
      .cookie('accessToken', accessToken, { httpOnly: true, /* secure: true, */ maxAge: ACCESS_TOKEN_EXPIRATION })
      .send();
  }

  /**
   * Refresh tokens
   * @param req
   * @param res
   */
  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.cookies; // get refresh token from cookies
    if (!refreshToken) throw AuthenticationError('you are not authenticated', { logit: false });

    // verify refresh token
    const decoded = await AuthService.verifyJwtRefreshToken(refreshToken);
    if (!decoded) throw AuthenticationError('you are not authenticated', { logit: false });

    // check token validity
    const user = await UserService.getOne(decoded.id);
    if (!user) throw AuthenticationError('you are not authenticated', { logit: false });

    // generate tokens
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const newRefreshToken = await AuthService.generateJwtRefreshToken(user);

    res
      .status(200) // send tokens
      .cookie('refreshToken', newRefreshToken, { httpOnly: true, /* secure: true, */ maxAge: REFRESH_TOKEN_EXPIRATION })
      .cookie('accessToken', accessToken, { httpOnly: true, /* secure: true, */ maxAge: ACCESS_TOKEN_EXPIRATION })
      .send();
  }

  /**
   * Logout
   * @param _req
   * @param res
   */
  static async logout(_req: Request, res: Response) {
    res.status(200).clearCookie('refresh_token').clearCookie('access_token').send();
  }
}
