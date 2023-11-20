import type { ObjectSchema } from 'joi';
import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from './auth';
import BasicError from '../errors/BasicError';

// Types
type Prop = 'body' | 'params' | 'query';
type SchemaOptions = ObjectSchema | ObjectSchema[];

type Options = {
  /**
   * If true, the middleware will throw an error if the user is not authenticated
   * @default true
   */
  authRequired?: boolean,

  /**
   * If true, the middleware will validate the request body as self
   * @default null
   */
  self?: string
};

/**
 * Validate request body, params or query
 * @param schema
 * @param props
 * @param options
 * @returns
 */
export const validate = (schema: SchemaOptions, props: Prop[] = ['body'], options?: Options) => {
  const authRequired = options?.authRequired ?? true; // default to true

  const controller = (request: Request, _res: Response, next: NextFunction) => {
    const req = request as AuthRequest<false>; // get request

    // check if user is authenticated if required
    if (authRequired && !req.user) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit: false });

    const schemas = Array.isArray(schema) ? schema : [schema]; // get schemas

    let params = { } as any; // get params
    if (props.includes('body')) params = { ...params, ...req.body };
    if (props.includes('params')) params = { ...params, ...req.params };
    if (props.includes('query')) params = { ...params, ...req.query };

    // validate params
    schemas.forEach((s) => {
      if (!s) return;
      const { error } = s.validate(params);
      if (error) throw error;
    });

    return next();
  };

  return controller;
};
