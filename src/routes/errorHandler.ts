import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { BasicError } from '../errors/BasicError';
import { ErrorCode, ErrorCodes } from '../errors/BaseError';
import { ApiLogService } from './api/logs/ApiLogService';
import type { AuthRequest } from '../middlewares/auth';

// Interfaces
interface Params {
  code: ErrorCode;
  message: string;
  status: number;
  details?: { message: string; context: { key: string | undefined; value: unknown } }[];
}

/**
 * Error handler middleware
 * @description This middleware is used to handle errors thrown by the application
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (error: Error, req: Request, res: Response, _next: NextFunction) => {
  // default params
  let params = { code: 'UNKNOW_ERROR' as ErrorCode, message: ErrorCodes.UNKNOW_ERROR as string, status: 500 } as Params;
  let logit = false; // whether to log the error or not

  if (error instanceof BasicError) {
    // if error is a BasicError
    params = { code: error.code, message: error.message, status: error.status }; // set params
    logit = error.options.logit ?? true; // set logit
  } else if (error instanceof Joi.ValidationError) {
    // if error is a Joi.ValidationError
    params = {
      code: 'VALIDATION_ERROR',
      message: error.message,
      status: 400,
      details: error.details.map((detail) => ({
        // set specific params for Joi.ValidationError
        message: detail.message,
        context: { key: detail.context?.key, value: detail.context?.value },
      })),
    };
  } else logit = true; // if error is not a BasicError or a Joi.ValidationError, log it

  if (params.status === 500) console.error(error);

  res.status(params.status).json(params); // send error response

  if (logit) {
    const user = (req as AuthRequest).user || null;
    await ApiLogService.from(error, user, req as AuthRequest<false>);
  }
};
