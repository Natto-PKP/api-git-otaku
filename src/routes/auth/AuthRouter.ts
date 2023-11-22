import { Router } from 'express';

import { validate } from '../../middlewares/validate';
import { AuthController } from './AuthController';
import { LoginSchema, RegisterSchema } from './AuthSchema';
import { handler } from '../../helpers/handler';

export const AuthRouter = Router();

/**
 * Login
 * @route POST /auth/login
 * @group Auth - Operations about auth
 * @returns {IAuthResponse} 200 - The auth response
 * @returns {Error} 400 - Bad request
 */
AuthRouter.post('/login', validate(LoginSchema, ['body', 'query']), handler(AuthController.login));

/**
 * Register
 * @route POST /auth/register
 * @group Auth - Operations about auth
 * @returns {IAuthResponse} 201 - The auth response
 * @returns {Error} 400 - Bad request
 */
AuthRouter.post('/register', validate(RegisterSchema, ['body', 'query']), handler(AuthController.register));

/**
 * Refresh
 * @route POST /auth/refresh
 * @group Auth - Operations about auth
 * @returns {IAuthResponse} 200 - The auth response
 * @returns {Error} 400 - Bad request
 */
AuthRouter.post('/refresh', handler(AuthController.refresh));

/**
 * Logout
 * @route DELETE /auth/logout
 * @group Auth - Operations about auth
 * @returns {void} 204 - No content
 */
AuthRouter.delete('/logout', handler(AuthController.logout));
