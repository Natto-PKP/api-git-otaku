import type { NextFunction, Request, Response } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;

/**
 * Handler
 * @description Handle async errors
 * @param controller
 * @returns
 */
export const handler = (controller: Controller) => {
  const r = (req: Request, res: Response, next: NextFunction) => {
    const promise = Promise.resolve(controller(req, res, next)).catch(next);
    return promise;
  };

  return r;
};
