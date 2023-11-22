import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { UserGetAllQuerySchema } from './UserSchema';
import { handler } from '../../helpers/handler';
import { UserController } from './UserController';
import auth from '../../middlewares/auth';
import { UserValidation } from './UserValidation';
import { UserSanctionRouter } from './sanctions/UserSanctionRouter';
import { UserScopes } from '../../models/User/UserScopes';

export const UserRouter = Router();

UserRouter.use('/:userId/sanctions', UserSanctionRouter);

/**
 * Get all users
 * @route GET /users
 * @group Users - Operations about users
 * @returns {Array<IUserModel>} 200 - An array of users info
 */
UserRouter.get(
  '/',
  handler(auth({ required: false, scopes: UserScopes })), // auth middleware, but not required
  validate(UserGetAllQuerySchema, ['body', 'query'], { allowPagination: true, allowScope: true }), // validate query
  handler(UserController.getAll), // handle request
);

/**
 * Create a new user
 * @route POST /users
 * @group Users - Operations about users
 * @param {string} identifier.param.required - Can be an id, username or '@me'
 * @returns {IUserModel} 201 - The created user info
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Not found
 */
UserRouter.get(
  '/:identifier',
  handler(
    auth({
      required: false,
      allowSelf: true,
      allowMeParam: true,
      allowUserIdentifierParam: true,
      scopes: UserScopes,
    }),
  ), // can't use @me if not logged in
  validate(null, ['body', 'query'], { allowScope: true }), // validate params
  handler(UserController.getOne),
);

/**
 * Create a new user
 * @route POST /users
 * @group Users - Operations about users
 * @param {string} userId.param.required - The user id
 * @returns {IUserModel} 201 - The created user info
 */
UserRouter.delete('/:userId', handler(auth({ allowOnlySelf: true })), handler(UserController.deleteOne));

/**
 * Create a new user
 * @route POST /users
 * @group Users - Operations about users
 * @param {string} userId.param.required - The user id
 * @returns {IUserModel} 201 - The created user info
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Not found
 */
UserRouter.patch(
  '/:userId',
  handler(auth({ allowOnlyAdminOrHigher: true, allowOnlySelf: true })),
  handler(UserValidation.updateOne),
  handler(UserController.updateOne),
);
