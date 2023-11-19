import type { Request, Response } from 'express';
import PaginationService from '../../utils/PaginationUtil';
import { LogService } from './LogService';
import BasicError from '../../errors/BasicError';
import type { AuthRequest } from '../../middlewares/auth';

/**
 * Log controller
 */
export class LogController {
  /**
   * Get all logs
   * @param request
   * @param res
   */
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const { scope } = req;

    const data = await LogService.getAll(pagination, params, { count: true, scope });

    res.status(200).json(data);
  }

  /**
   * Get one log
   * @param request
   * @param res
   */
  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { scope, params: { logId } } = req;

    const data = await LogService.getOne(logId, { scope });
    if (!data) throw new BasicError({ type: 'ERROR', code: 'NOT_FOUND', status: 404 }, { logit: false });

    res.status(200).json(data);
  }

  /**
   * Delete one log
   * @param request
   * @param res
   */
  static async deleteOne(req: Request, res: Response) {
    const { logId } = req.params;
    await LogService.deleteOne(logId);

    res.status(204).send();
  }
}
