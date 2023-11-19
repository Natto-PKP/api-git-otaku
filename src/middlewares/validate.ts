import type { ObjectSchema } from 'joi';
import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from './auth';
import BasicError from '../errors/BasicError';
import type { UserRole } from '../models/User/UserUtils';

// Types
type Prop = 'body' | 'params' | 'query';
type Role = UserRole | 'ALL' | 'SELF';
type RoleSchema = { [key in Role]: ObjectSchema | ObjectSchema[] };
type SchemaOptions = ObjectSchema | ObjectSchema[] | Partial<RoleSchema>;

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
  const self = options?.self ?? null;

  const controller = (request: Request, _res: Response, next: NextFunction) => {
    const req = request as AuthRequest<false>; // get request

    // check if user is authenticated if required
    if (authRequired && !req.user) throw new BasicError({ type: 'ERROR', code: 'UNAUTHORIZED', status: 401 }, { logit: false });

    const schemas = [] as (ObjectSchema | ObjectSchema[])[];
    const rs = schema as RoleSchema;

    if (req.user) {
      const { role } = req.user; // get user role
      if (role in schema && rs[role]) schemas.push(rs[role]);
      if (self && req.params[self] === req.user.id && 'SELF' in schema && rs.SELF) schemas.push(rs.SELF);
    }

    if ('ALL' in schema && rs.ALL) schemas.push(rs.ALL);
    if (!schemas.length) return next(); // no schema to validate

    let params = { } as any; // get params
    if (props.includes('body')) params = { ...params, ...req.body };
    if (props.includes('params')) params = { ...params, ...req.params };
    if (props.includes('query')) params = { ...params, ...req.query };

    // validate params
    schemas.flat().forEach((s) => {
      if (!s) return;
      const { error } = s.validate(params);
      if (error) throw error;
    });

    return next();
  };

  return controller;
};
