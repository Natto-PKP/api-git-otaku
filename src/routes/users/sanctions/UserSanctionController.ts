import type { Request, Response } from 'express';
import type { AuthRequest } from '../../../middlewares/auth';
import { PaginationService } from '../../../utils/PaginationUtil';
import { ForbiddenError, NotFoundError } from '../../../errors/BasicError';
import { UserSanctionService } from './UserSanctionService';
import { UserService } from '../UserService';

export class UserSanctionController {
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const data = await UserSanctionService.getAll(
      pagination,
      { ...params, userId: req.params.userId },
      { count: true, scope },
    );

    res.status(200).json(data);
  }

  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const scope = req.scope || null;
    const { sanctionId, userId } = req.params;

    const data = await UserSanctionService.getOneByUserId(sanctionId, userId, { scope });

    if (!data) throw NotFoundError('sanction not found', { logit: false });

    res.status(200).json(data);
  }

  static async createOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { body, user } = req;

    const target = await UserService.getOne(req.params.userId);
    if (!target) throw NotFoundError('user not found', { logit: false });

    // can't sanction someone with a higher role than you
    if (target.isRoleHigherOrEqual(user.role)) throw ForbiddenError("you can't sanction this user", { logit: false });

    // can't sanction yourself
    if (target.id === user.id) throw ForbiddenError("you can't sanction yourself", { logit: false });

    // can't sanction someone who is already banned
    const isAlreadyBanned = await UserSanctionService.isAlreadySanctioned(target.id, ['BAN', 'TEMP_BAN']);
    if (isAlreadyBanned) throw ForbiddenError('this user is already banned', { logit: false });

    const data = await UserSanctionService.createOne({ ...body, userId: target.id, byUserId: user.id });

    res.status(201).json(data);
  }

  static async cancelOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const {
      params: { sanctionId, userId },
    } = req;

    const sanction = await UserSanctionService.getOneByUserId(sanctionId, userId);

    if (!sanction) throw NotFoundError('sanction not found', { logit: false });
    await UserSanctionService.cancelOne(sanction, req.body);

    res.status(204).end();
  }

  static async deleteOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const {
      params: { sanctionId, userId },
    } = req;

    const sanction = await UserSanctionService.getOneByUserId(sanctionId, userId);

    if (!sanction) throw NotFoundError('sanction not found', { logit: false });
    await UserSanctionService.deleteOne(sanction);

    res.status(204).end();
  }

  static async clear(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { userId } = req.params;

    await UserSanctionService.clear(userId);

    res.status(204).end();
  }
}
