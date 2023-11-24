import type { NextFunction, Request, Response } from 'express';
import { AuthenticationError, BasicError, PermissionError } from '../errors/BasicError';
import type { UserModel } from '../models/User/UserModel';
import { UserService } from '../routes/users/UserService';
import { AuthService } from '../routes/auth/AuthService';
import { Scope, ScopeUtil } from '../utils/ScopeUtil';
import { UserPermission, UserRole } from '../models/User/UserUtils';

// Types
interface AuthOptions {
  logit?: boolean | null;
  ignoreScanctionedUser?: boolean | null; // ignore if user is banned
  required?: boolean | null; // if false, will not throw error if not authenticated
  allowSelf?: boolean | null; // allow user to access his own data
  allowOnlySelf?: boolean | null; // only allow user to access his own data
  allowMeParam?: boolean | null; // allow user to use @me param
  allowUserIdentifierParam?: boolean | null; // allow user to use an username as param
  allowOnlyRoles?: UserRole[] | null; // only allow user with specific roles
  allowOnlyPermissions?: UserPermission[] | null; // only allow user with specific permissions
  selfParamName?: string | null; // param name to get user id, username or @me
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
  const allowSelf = options?.allowSelf ?? false;
  const allowOnlySelf = options?.allowOnlySelf ?? false;
  const allowMeParam = options?.allowMeParam ?? false;
  const allowUserIdentifierParam = options?.allowUserIdentifierParam ?? false;
  const allowOnlyRoles = options?.allowOnlyRoles ?? null;
  const allowOnlyPermissions = options?.allowOnlyPermissions ?? null;
  const selfParamName = options?.selfParamName ?? 'userId';
  const scopeUtil = options?.scopes ?? null;
  const scopeParamName = options?.scopeParamName ?? 'scope';

  const controller = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;
      if (!accessToken) throw AuthenticationError('no token provided', { logit });

      const decoded = await AuthService.verifyJwtAccessToken(accessToken, logit);
      if (!decoded) throw AuthenticationError('invalid token', { logit });
      if (!decoded.id || !decoded.exp) throw AuthenticationError('invalid token', { logit });

      if (Date.now() / 1000 >= decoded.exp) {
        throw new BasicError({ code: 'TOKEN_EXPIRED', status: 401, message: 'token expired' }, { logit });
      }

      // check user validity
      const user = await UserService.getOne(decoded.id);
      if (!user) throw AuthenticationError('invalid token', { logit });

      // check if user is self
      const selfParam = req.params[selfParamName];
      let isSelf = false;
      if ((allowSelf || allowOnlySelf) && selfParam) {
        if (allowMeParam && selfParam === '@me') isSelf = true;
        else if (allowUserIdentifierParam && user.username === selfParam) isSelf = true;
        else if (user.id === selfParam) isSelf = true;
      }

      // roles
      if (!isSelf && allowOnlyRoles && !allowOnlyRoles.includes(user.role)) {
        throw PermissionError('missing permission to access this endpoint', { logit });
      }

      // permissions
      if (!isSelf && allowOnlyPermissions && !user.hasPermissions(allowOnlyPermissions)) {
        throw PermissionError('missing permission to access this endpoint', { logit });
      }

      // self
      if (allowSelf && !isSelf && allowOnlyPermissions?.length && allowOnlyRoles?.length) {
        throw PermissionError('missing permission to access this endpoint', { logit });
      }

      if (allowOnlySelf && !isSelf) {
        throw PermissionError('missing permission to access this endpoint', { logit });
      }

      // scope
      const params = { ...req.query, ...req.body };
      const scope = params[scopeParamName] as Scope;
      if (scopeUtil && scope && !scopeUtil.verify(scope, { self: isSelf, role: user.role })) {
        throw PermissionError(`missing permission to use scope "${scope}"`, { logit });
      }

      // auth request
      const authRequest = req as AuthRequest;
      authRequest.user = user;
      authRequest.isSelf = isSelf;
      authRequest.scope = scope || 'public';

      next();
    } catch (error) {
      if (!required) next();
      else next(error);
    }
  };

  return controller;
};
