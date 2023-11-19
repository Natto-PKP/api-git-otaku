import type { NextFunction, Request, Response } from 'express';
import BasicError from '../errors/BasicError';
import type { UserModel } from '../models/User/UserModel';
import { UserService } from '../routes/users/UserService';
import { AuthService } from '../routes/auth/AuthService';
import type { UserRole } from '../models/User/UserUtils';

// Types
interface AuthOptions {
  /**
   * If true, the middleware will log errors
   */
  logit?: boolean | null;

  /**
   * If true, the middleware will ignore banned users
   * @default false
   */
  ignoreBannedUser?: boolean | null;

  /**
   * If true, the middleware will ignore blocked users
   * @default false
   */
  ignoreBlockedUser?: boolean | null;

  /**
   * If true, the middleware will check user role
   * @default null
   */
  roles?: UserRole[] | null;

  /**
   * If true, the middleware will throw an error if the user is not authenticated
   * @default true
   */
  required?: boolean | null;

  /**
   * If true, the middleware will check if the user is the owner of the resource
   * If role is set, the middleware will check if is the owner of the resource or has the role
   * @default null
   */
  self?: string | null;
}

export type BaseScope = 'public' | 'internal' | 'private' | 'system';

export interface AuthRequest<R extends boolean = true> extends Request {
  /**
   * Authenticated user
   */
  user: R extends true ? UserModel : UserModel | null | undefined;

  /**
   * Authenticated user scope
   */
  scope: R extends true ? BaseScope : BaseScope | null | undefined;
}

/**
 * Auth middleware
 * @param options
 * @returns
 */
export default (options?: AuthOptions) => {
  const required = options?.required ?? true;
  const logit = options?.logit ?? false;
  const ignoreBannedUser = options?.ignoreBannedUser ?? false;
  const ignoreBlockedUser = options?.ignoreBlockedUser ?? false;
  const roles = options?.roles ?? null;
  const self = options?.self ?? null;

  const controller = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // get token from header
      const { accessToken } = req.cookies;
      if (!accessToken) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });

      // verify token
      const decoded = await AuthService.verifyJwtAccessToken(accessToken, logit);
      if (!decoded) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });

      // check token validity
      if (!decoded.id || !decoded.exp) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });
      if (Date.now() / 1000 >= decoded.exp) throw new BasicError({ type: 'ERROR', code: 'TOKEN_EXPIRED', status: 401 }, { logit });

      // check user validity
      const user = await UserService.getOne(decoded.id);
      if (!user) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit });

      // check if user is banned
      if (user.isBanned && !ignoreBannedUser) throw new BasicError({ type: 'ERROR', code: 'BANNED', status: 403 }, { logit });

      // check if user is blocked
      if (user.isBlocked) {
        const blockedUntil = user.blockedUntil?.getTime() || null;
        if (!blockedUntil) UserService.updateOne(user, { isBlocked: false, blockedUntil: null });
        else if (Date.now() >= blockedUntil) {
          await UserService.updateOne(user, { isBlocked: false, blockedUntil: null });
        } else if (!ignoreBlockedUser) throw new BasicError({ type: 'ERROR', code: 'BLOCKED', status: 403 }, { logit });
      }

      // check user role
      if (roles) {
        if (!self && !roles.includes(user.role)) throw new BasicError({ type: 'ERROR', code: 'MISSING_PERMISSION', status: 403 }, { logit });
        else if (self && req.params[self] !== user.id) throw new BasicError({ type: 'ERROR', code: 'MISSING_PERMISSION', status: 403 }, { logit });
      } else if (self && req.params[self] !== user.id) throw new BasicError({ type: 'ERROR', code: 'MISSING_PERMISSION', status: 403 }, { logit });

      // auth request
      const authRequest = req as AuthRequest;
      authRequest.user = user;

      authRequest.scope = 'public';
      if (user.isAdmin) authRequest.scope = 'private';
      else if (user.isHelper) authRequest.scope = 'internal';

      next();
    } catch (error) {
      if (required) next(error);
      else next();
    }
  };

  return controller;
};
