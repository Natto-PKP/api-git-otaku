import { Router } from 'express';

import { handler } from '../../../helpers/handler';
import { ApiLogController } from './ApiLogController';
import auth from '../../../middlewares/auth';
import { validate } from '../../../middlewares/validate';
import { ApiLogGetAllQuerySchema } from './ApiLogSchema';
import { ApiLogScopes } from '../../../models/Api/ApiLog/ApiLogScopes';

export const ApiLogRouter = Router();

/**
 * Get all apilogs
 * @route GET /apilogs
 * @group ApiLogs - Operations about apilogs
 * @returns {Array<IApiLogModel>} 200 - An array of apilogs info
 */
ApiLogRouter.get(
  '/',
  handler(auth({ allowOnlyPermissions: ['api.log.view'], scopes: ApiLogScopes })),
  validate(ApiLogGetAllQuerySchema, ['body', 'query'], { allowPagination: true, allowScope: true }),
  handler(ApiLogController.getAll),
);

/**
 * Get one apilog
 * @route GET /apilogs/:apiLogId
 * @group ApiLogs - Operations about apilogs
 * @returns {IApiLogModel} 200 - The apilog info
 * @returns {Error} 404 - Not found
 */
ApiLogRouter.get(
  '/:apiLogId',
  handler(auth({ allowOnlyPermissions: ['api.log.view'], scopes: ApiLogScopes })),
  validate(null, ['body', 'query'], { allowScope: true }),
  handler(ApiLogController.getOne),
);

/**
 * Delete one apilog
 * @route DELETE /apilogs/:apiLogId
 * @group ApiLogs - Operations about apilogs
 * @returns {void} 204 - No content
 */
ApiLogRouter.delete(
  '/:apiLogId',
  handler(auth({ allowOnlyPermissions: ['api.log.manage'] })),
  handler(ApiLogController.deleteOne),
);
