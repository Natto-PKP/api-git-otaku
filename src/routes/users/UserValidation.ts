import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { UserService } from './UserService';
import { ForbiddenError, NotFoundError, PermissionError } from '../../errors/BasicError';

export class UserValidation {
  static async getAllQueryParams(request: Request, _res: Response, next: NextFunction) {
    try {
      const req = request as AuthRequest<false>;
      const user = req.user;

      const params = { ...req.query, ...req.body };

      if ('role' in params && !user?.hasPermissions('user.manage.role'))
        throw PermissionError("you can't filter by role", { logit: false });

      if ('isVerified' in params && !user?.hasPermissions('user.manage.verified'))
        throw PermissionError("you can't filter by verified", { logit: false });

      next();
    } catch (error) {
      next(error);
    }
  }

  static async updateOneBodyParams(request: Request, _res: Response, next: NextFunction) {
    try {
      const req = request as AuthRequest;
      const user = req.user;
      const target = await UserService.getOne(req.params.userId);

      if (!target) throw NotFoundError('user not found', { logit: false });

      const { role, email, password, isPrivate } = req.body;

      if (user.id !== target.id) {
        if (!user.hasPermissions('user.manage'))
          throw PermissionError('you can only update your own user', { logit: false });
        if ('isPrivate' in req.body && isPrivate !== target.isPrivate)
          throw ForbiddenError("you can't change this user's privacy", { logit: false });
        if ('email' in req.body && email !== target.email)
          throw ForbiddenError("you can't change this user's email", { logit: false });
        if ('password' in req.body && password !== target.password)
          throw ForbiddenError("you can't change this user's password", { logit: false });
      }

      if ('role' in req.body && role !== target.role) {
        if (!user.hasPermissions('user.manage.role'))
          throw PermissionError("you can't change users role", { logit: false });
        if (user.id === target.id) throw ForbiddenError("you can't change your own role", { logit: false });
        if (user.isRoleHigherOrEqual(role))
          throw ForbiddenError("you can't add a role upper or equal than your current one", { logit: false });
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
