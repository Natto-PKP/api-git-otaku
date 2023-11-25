import { Controller, Route, Delete, Request, Middlewares, Post, Tags } from 'tsoa';
import { Request as ExRequest } from 'express';

import { ACCESS_TOKEN_EXPIRATION, AuthService, REFRESH_TOKEN_EXPIRATION } from './AuthService';
import { UserService } from '../users/UserService';
import { AuthenticationError, BasicError } from '../../errors/BasicError';
import { UserSanctionService } from '../users/sanctions/UserSanctionService';
import { validate } from '../../middlewares/validate';
import { LoginSchema, RegisterSchema } from './AuthSchema';

@Tags('auth')
@Route('auth')
export class AuthController extends Controller {
  @Middlewares(validate(LoginSchema, ['body', 'query']))
  @Post('login')
  public async login(@Request() req: ExRequest) {
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

    this.setStatus(200);
    this.setHeader('Set-Cookie', [
      `refreshToken=${refreshToken}; HttpOnly; Max-Age=${REFRESH_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
      `accessToken=${accessToken}; HttpOnly; Max-Age=${ACCESS_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
    ]);
  }

  @Middlewares(validate(RegisterSchema, ['body', 'query']))
  @Post('register')
  public async register(@Request() req: ExRequest) {
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

    this.setStatus(201);
    this.setHeader('Set-Cookie', [
      `refreshToken=${refreshToken}; HttpOnly; Max-Age=${REFRESH_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
      `accessToken=${accessToken}; HttpOnly; Max-Age=${ACCESS_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
    ]);
  }

  @Post('refresh')
  public async refresh(@Request() req: ExRequest) {
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

    this.setStatus(200);
    this.setHeader('Set-Cookie', [
      `refreshToken=${newRefreshToken}; HttpOnly; Max-Age=${REFRESH_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
      `accessToken=${accessToken}; HttpOnly; Max-Age=${ACCESS_TOKEN_EXPIRATION}; Path=/; SameSite=Lax;`,
    ]);
  }

  @Delete('logout')
  public async logout() {
    this.setStatus(204);

    this.setHeader('Set-Cookie', [
      `refreshToken=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax;`,
      `accessToken=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax;`,
    ]);
  }
}
