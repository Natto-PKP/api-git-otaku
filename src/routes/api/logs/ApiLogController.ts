import type { Request, Response } from 'express';
import { PaginationService } from '../../../utils/PaginationUtil';
import { ApiLogService } from './ApiLogService';
import { NotFoundError } from '../../../errors/BasicError';
import type { AuthRequest } from '../../../middlewares/auth';

/**
 * ApiLog controller
 */
export class ApiLogController {
  /**
   * Get all apilogs
   * @param request
   * @param res
   */
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const data = await ApiLogService.getAll(pagination, params, { count: true, scope });

    res.status(200).json(data);
  }

  /**
   * Get one apilog
   * @param request
   * @param res
   */
  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { apiLogId } = req.params;
    const scope = req.scope || null;

    const data = await ApiLogService.getOne(apiLogId, { scope });
    if (!data) throw NotFoundError('api log not found', { logit: false });

    res.status(200).json(data);
  }

  /**
   * Delete one apilog
   * @param request
   * @param res
   */
  static async deleteOne(req: Request, res: Response) {
    const { apiLogId } = req.params;

    const log = await ApiLogService.getOne(apiLogId);
    if (!log) throw NotFoundError('api log not found', { logit: false });

    await ApiLogService.deleteOne(apiLogId);

    res.status(204).send();
  }
}
