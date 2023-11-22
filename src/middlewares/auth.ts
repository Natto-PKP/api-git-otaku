import type { NextFunction, Request, Response } from 'express';
import BasicError from '../errors/BasicError';
import type { UserModel } from '../models/User/UserModel';
import { UserService } from '../routes/users/UserService';
import { AuthService } from '../routes/auth/AuthService';
import { Scope, ScopeUtil } from '../utils/ScopeUtil';

// Types
interface AuthOptions {
  logit?: boolean | null;
  ignoreScanctionedUser?: boolean | null; // ignore if user is banned
  required?: boolean | null; // if false, will not throw error if not authenticated
  allowSelf?: boolean | null; // allow user to access his own data
  allowOnlySelf?: boolean | null; // only allow user to access his own data
  allowMeParam?: boolean | null; // allow user to use @me param
  allowUserIdentifierParam?: boolean | null; // allow user to use an username as param
  selfParamName?: string | null; // param name to get user id, username or @me
  allowOnlyAdminOrHigher?: boolean | null; // only allow admin or higher to access this resource
  allowOnlyHelperOrHigher?: boolean | null; // only allow helper or higher to access this resource
  scopes?: ScopeUtil | null;
  scopeParamName?: string | null; // param name to get scope
}

export interface AuthRequest<R extends boolean = true> extends Request {
  user: R extends true ? UserModel : UserModel | null | undefined;
  isSelf: R extends true ? boolean : boolean | null | undefined;
  scope: R extends true ? Scope : Scope | null | undefined;
}

/**
 * Auth middleware
 * @param options
 * @returns
 */
export default (options?: AuthOptions) => {
  const required = options?.required ?? true;
  const logit = options?.logit ?? false;
  const ignoreScanctionedUser = options?.ignoreScanctionedUser ?? false;
  const allowSelf = options?.allowSelf ?? false;
  const allowOnlySelf = options?.allowOnlySelf ?? false;
  const allowMeParam = options?.allowMeParam ?? false;
  const allowUserIdentifierParam = options?.allowUserIdentifierParam ?? false;
  const selfParamName = options?.selfParamName ?? 'userId';
  const allowOnlyAdminOrHigher = options?.allowOnlyAdminOrHigher ?? false;
  const allowOnlyHelperOrHigher = options?.allowOnlyHelperOrHigher ?? false;
  const scopeUtil = options?.scopes ?? null;
  const scopeParamName = options?.scopeParamName ?? 'scope';

  const controller = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // get token from header
      const { accessToken } = req.cookies;

      if (!accessToken) throw new BasicError({ code: 'UNAUTHORIZED', status: 401, message: 'No token' }, { logit });

      // verify token
      const decoded = await AuthService.verifyJwtAccessToken(accessToken, logit);
      if (!decoded) throw new BasicError({ code: 'UNAUTHORIZED', status: 401, message: 'Invalid token' }, { logit });

      // check token validity
      if (!decoded.id || !decoded.exp) {
        throw new BasicError({ code: 'UNAUTHORIZED', status: 401, message: 'Invalid token' }, { logit });
      }

      if (Date.now() / 1000 >= decoded.exp) {
        throw new BasicError({ code: 'TOKEN_EXPIRED', status: 401, message: 'Token expired' }, { logit });
      }

      // check user validity
      const user = await UserService.getOne(decoded.id);

      if (!user) throw new BasicError({ code: 'UNAUTHORIZED', status: 401, message: 'Invalid token' }, { logit });

      // check if user is banned
      if (!ignoreScanctionedUser && (await user.isBanned())) {
        throw new BasicError({ code: 'UNAUTHORIZED', status: 401, message: 'You are banned' }, { logit });
      }

      // check if user is self
      const selfParam = req.params[selfParamName];
      let isSelf = false;
      if ((allowSelf || allowOnlySelf) && selfParam) {
        if (allowMeParam && selfParam === '@me') isSelf = true;
        else if (allowUserIdentifierParam && user.username === selfParam) isSelf = true;
        else if (user.id === selfParam) isSelf = true;
      }

      const isAdminOrHigherAllowed = allowOnlyAdminOrHigher && user.isAdminOrHigher();
      const isHelperOrHigherAllowed = allowOnlyHelperOrHigher && user.isHelperOrHigher();

      // check if user has permission
      if (!isSelf && allowOnlyHelperOrHigher && !user.isHelperOrHigher()) {
        throw new BasicError(
          { code: 'MISSING_PERMISSION', status: 403, message: 'Only helpers can access this resource' },
          { logit },
        );
      } else if (!isSelf && allowOnlyAdminOrHigher && !user.isAdminOrHigher()) {
        throw new BasicError(
          { code: 'MISSING_PERMISSION', status: 403, message: 'Only admins can access this resource' },
          { logit },
        );
      } else if (allowOnlySelf && !isSelf && !isAdminOrHigherAllowed && !isHelperOrHigherAllowed) {
        throw new BasicError({ code: 'MISSING_PERMISSION', status: 403, message: 'You are not this user' }, { logit });
      }

      // scope
      const scope = req.params[scopeParamName] as Scope;
      if (scopeUtil && scope) {
        const scopeIsValide = scopeUtil.verify(scope, { self: isSelf, role: user.role });

        if (!scopeIsValide) {
          throw new BasicError(
            { code: 'MISSING_PERMISSION', status: 403, message: 'Missing permission for this scope' },
            { logit },
          );
        }
      }

      // auth request
      const authRequest = req as AuthRequest;
      authRequest.user = user;
      authRequest.isSelf = isSelf;
      authRequest.scope = scope || 'public';

      next();
    } catch (error) {
      if (required) next(error);
      else next();
    }
  };

  return controller;
};
