import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
  UserAdminUpdateBodySchema,
  UserGetAllQuerySchema,
  UserSelfUpdateBodySchema,
} from './UserSchema';
import { handler } from '../../helpers/handler';
import { UserController } from './UserController';
import auth from '../../middlewares/auth';

export const UserRouter = Router();

/**
 * Get all users
 * @route GET /users
 * @group Users - Operations about users
 * @returns {Array<IUserModel>} 200 - An array of users info
 */
UserRouter.get(
  '/',
  handler(auth({ required: false })), // auth middleware, but not required
  validate(UserGetAllQuerySchema, ['body', 'query'], { authRequired: false }), // validate query
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
  handler(auth({ required: false })), // can't use @me if not logged in
  handler(UserController.getOne),
);

/**
 * Create a new user
 * @route POST /users
 * @group Users - Operations about users
 * @param {string} userId.param.required - The user id
 * @returns {IUserModel} 201 - The created user info
 */
UserRouter.delete(
  '/:userId',
  handler(auth({ roles: ['ADMIN', 'OWNER'], self: 'userId' })),
  handler(UserController.deleteOne),
);

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
  handler(auth({ roles: ['ADMIN', 'OWNER'], self: 'userId' })),
  validate({
    SELF: UserSelfUpdateBodySchema, // apply only if self
    ADMIN: UserAdminUpdateBodySchema, // apply only if admin
  }, ['body'], { self: 'userId' }), // indicate where to get the user id
  handler(UserController.updateOne),
);