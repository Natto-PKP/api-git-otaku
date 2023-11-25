import { Controller, Route, Delete, Request, Middlewares, Get, Tags } from 'tsoa';

import { PaginationService } from '../../../utils/PaginationUtil';
import { ApiLogService } from './ApiLogService';
import { NotFoundError } from '../../../errors/BasicError';
import type { AuthRequest } from '../../../middlewares/auth';
import auth from '../../../middlewares/auth';
import { IApiLogModel } from '../../../models';

@Tags('api')
@Route('api/logs')
export class ApiLogController extends Controller {
  @Middlewares(auth({ allowOnlyPermissions: ['api.log'] }))
  @Get()
  public async getAll(@Request() req: AuthRequest) {
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const result = await ApiLogService.getAll(pagination, params, { count: true, scope });

    const data = result.data as IApiLogModel[];

    return { ...result, data };
  }

  @Middlewares(auth({ allowOnlyPermissions: ['api.log'] }))
  @Get('{apiLogId}')
  public async getOne(@Request() req: AuthRequest) {
    const { apiLogId } = req.params;
    const scope = req.scope || null;

    const data = await ApiLogService.getOne(apiLogId, { scope });
    if (!data) throw NotFoundError('api log not found', { logit: false });

    return data as IApiLogModel;
  }

  @Middlewares(auth({ allowOnlyPermissions: ['api.log.manage'] }))
  @Delete('{apiLogId}')
  public async deleteOne(@Request() req: AuthRequest) {
    const { apiLogId } = req.params;

    const log = await ApiLogService.getOne(apiLogId);
    if (!log) throw NotFoundError('api log not found', { logit: false });

    await ApiLogService.deleteOne(apiLogId);
  }
}
