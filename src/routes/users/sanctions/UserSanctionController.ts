import type { Request, Response } from 'express';
import type { AuthRequest } from '../../../middlewares/auth';
import { PaginationService } from '../../../utils/PaginationUtil';
import BasicError from '../../../errors/BasicError';
import { UserSanctionService } from './UserSanctionService';
import { UserService } from '../UserService';

export class UserSanctionController {
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope;

    const data = await UserSanctionService.getAll(pagination, params, { count: true, scope });

    res.status(200).json(data);
  }

  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const scope = req.scope;

    const {
      params: { sanctionId },
    } = req;

    const data = await UserSanctionService.getOne(sanctionId, { scope });

    if (!data)
      throw new BasicError(
        { type: 'ERROR', code: 'NOT_FOUND', status: 404, message: 'Sanction not found' },
        { logit: false },
      );

    res.status(200).json(data);
  }

  static async createOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { body } = req;

    const user = await UserService.getOne(body.userId);
    if (!user)
      throw new BasicError(
        { type: 'ERROR', code: 'NOT_FOUND', status: 404, message: 'User not found' },
        { logit: false },
      );

    // can't sanction someone with higher role or same role
    if (user.isAdminOrHigher())
      throw new BasicError(
        { type: 'ERROR', code: 'FORBIDDEN', status: 403, message: "You can't sanction this user" },
        { logit: false },
      );

    // can't sanction yourself
    if (user.id === req.user.id)
      throw new BasicError(
        { type: 'ERROR', code: 'FORBIDDEN', status: 403, message: "You can't sanction yourself" },
        { logit: false },
      );

    const data = await UserSanctionService.createOne({ ...body, byUserId: req.user.id });

    res.status(201).json(data);
  }

  static async cancelOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const {
      params: { sanctionId },
    } = req;

    const sanction = await UserSanctionService.getOne(sanctionId);

    if (!sanction) throw new BasicError({ type: 'ERROR', code: 'NOT_FOUND', status: 404 }, { logit: false });

    await UserSanctionService.cancelOne(sanction, req.body);

    res.status(204).end();
  }
}
