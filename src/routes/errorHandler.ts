import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import BasicError from '../errors/BasicError';
import { ErrorCode, ErrorCodes, ErrorType } from '../errors/BaseError';
import { LogService } from './logs/LogService';
import type { AuthRequest } from '../middlewares/auth';

// Interfaces
interface Params {
  code: ErrorCode;
  message: string;
  status: number;
  details?: { message: string; context: { key: string | undefined; value: any } }[];
}

/**
 * Error handler middleware
 * @description This middleware is used to handle errors thrown by the application
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (error: Error, req: Request, res: Response, _next: NextFunction) => {
  let type = 'ERROR' as ErrorType; // type of error

  // default params
  let params = { code: 'UNKNOW_ERROR' as ErrorCode, message: ErrorCodes.UNKNOW_ERROR as string, status: 500 } as Params;
  let logit = false; // whether to log the error or not

  if (error instanceof BasicError) { // if error is a BasicError
    type = error.type; // set type
    params = { code: error.code, message: error.message, status: error.status }; // set params
    logit = error.options.logit ?? true; // set logit
  } else if (error instanceof Joi.ValidationError) { // if error is a Joi.ValidationError
    params = {
      code: 'VALIDATION_ERROR',
      message: error.message,
      status: 400,
      details: error.details.map((detail) => ({ // set specific params for Joi.ValidationError
        message: detail.message,
        context: { key: detail.context?.key, value: detail.context?.value },
      })),
    };
  } else logit = true; // if error is not a BasicError or a Joi.ValidationError, log it

  console.log(error);
  res.status(params.status).json(params); // send error response

  if (logit) { // if error should be logged
    const user = (req as AuthRequest).user || null; // get user from request

    await LogService.createOne({
      type,
      status: params.status,
      code: params.code,
      message: params.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
      updatedById: user?.id || null,
      createdById: user?.id || null,
    });
  }
};
