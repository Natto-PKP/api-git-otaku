import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth';
import { PaginationService } from '../../utils/PaginationUtil';
import { UserService } from './UserService';
import { NotFoundError } from '../../errors/BasicError';
import { UsernameRegex } from '../../models/User/UserUtils';

/**
 * User controller
 */
export class UserController {
  /**
   * Get all users
   * @param request
   * @param res
   */
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest<false>;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const data = await UserService.getAll(pagination, params, { count: true, scope });

    res.status(200).json(data);
  }

  /**
   * Get one user
   * @param request
   * @param res
   */
  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest<false>;
    const { identifier } = req.params;
    const scope = req.scope || null;

    let data = null;
    if (identifier === '@me' && req.user) data = await UserService.getOne(req.user.id, { scope }); // get current user
    else if (UsernameRegex.test(identifier)) {
      data = await UserService.getOneByUsername(identifier, { scope });
    } else data = await UserService.getOne(identifier, { scope }); // get user by id

    if (!data) throw NotFoundError('user not found', { logit: false });

    res.status(200).json(data);
  }

  /**
   * Delete one user
   * @param request
   * @param res
   */
  static async deleteOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { userId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    await UserService.deleteOne(user);

    res.status(204).send();
  }

  /**
   * Update one user
   * @param request
   * @param res
   */
  static async updateOne(request: Request, res: Response) {
    const req = request as AuthRequest;

    await UserService.updateOne(req.params.userId, req.body);

    res.status(200).send();
  }
}
