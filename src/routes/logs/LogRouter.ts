import { Router } from 'express';

import { handler } from '../../helpers/handler';
import { LogController } from './LogController';
import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { LogGetAllQuerySchema } from './LogSchema';

export const LogRouter = Router();

/**
 * Get all logs
 * @route GET /logs
 * @group Logs - Operations about logs
 * @returns {Array<ILogModel>} 200 - An array of logs info
 */
LogRouter.get(
  '/',
  handler(auth({ adminOnly: true })), // you need to be admin or helper to get logs
  validate(LogGetAllQuerySchema, ['body', 'query']),
  handler(LogController.getAll)
);

/**
 * Get one log
 * @route GET /logs/:logId
 * @group Logs - Operations about logs
 * @returns {ILogModel} 200 - The log info
 * @returns {Error} 404 - Not found
 */
LogRouter.get(
  '/:logId',
  handler(auth({ adminOnly: true })), // you need to be admin or helper to get a log
  handler(LogController.getOne)
);

/**
 * Delete one log
 * @route DELETE /logs/:logId
 * @group Logs - Operations about logs
 * @returns {void} 204 - No content
 */
LogRouter.delete(
  '/:logId',
  handler(auth({ adminOnly: true })), // you need to be admin to delete a log
  handler(LogController.deleteOne)
);
