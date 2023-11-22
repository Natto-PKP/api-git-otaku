import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth';
import BasicError from '../../errors/BasicError';
import { UserAdminUpdateBodySchema, UserSelfUpdateBodySchema } from './UserSchema';

export class UserValidation {
  static updateOne(req: Request, _res: Response, next: NextFunction) {
    const { user } = req as AuthRequest<true>;
    if (!user) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit: false });

    let schema = UserSelfUpdateBodySchema; // get schema for self

    // check if user is admin or higher
    if (user.isAdminOrHigher()) {
      schema = UserAdminUpdateBodySchema; // get schema for admin

      // if user is trying to add a role upper or equal than his current one
      if (req.body.role && user.isRoleHigherOrEqual(req.body.role)) {
        throw new BasicError(
          {
            type: 'ERROR',
            code: 'MISSING_PERMISSION',
            status: 403,
            message: "Can't add a role upper or equal than your current one",
          },
          { logit: false },
        );
      }
    }

    // validate body
    const { error } = schema.validate(req.body);
    if (error) throw error;

    return next();
  }
}
