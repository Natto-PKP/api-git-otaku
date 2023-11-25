import type { ObjectSchema } from 'joi';
import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from './auth';
import Joi from 'joi';
import { ScopeSchemaData } from '../utils/ScopeUtil';
import { PaginationSchemaData } from '../utils/PaginationUtil';

// Types
type Prop = 'body' | 'params' | 'query';

type Options = {
  allowScope?: boolean | null;
  allowPagination?: boolean | null;
};

const EmptySchema = Joi.object().keys({});

/**
 * Validate request body, params or query
 * @param schema
 * @param props
 * @param options
 * @returns
 */
export const validate = (schema: ObjectSchema | null, props: Prop[] = ['body'], options?: Options) => {
  const allowScope = options?.allowScope ?? false;
  const allowPagination = options?.allowPagination ?? false;
  const sch = schema || EmptySchema;

  const controller = (request: Request, _res: Response, next: NextFunction) => {
    try {
      const req = request as AuthRequest<false>; // get request

      // validate params
      let params = {} as { [key: string]: unknown }; // get params
      if (props.includes('body')) params = { ...params, ...req.body };
      if (props.includes('params')) params = { ...params, ...req.params };
      if (props.includes('query')) params = { ...params, ...req.query };

      let schemaToValidate = sch;
      if (allowScope) schemaToValidate = schemaToValidate.keys(ScopeSchemaData);
      if (allowPagination) schemaToValidate = schemaToValidate.keys(PaginationSchemaData);

      const { error } = schemaToValidate.validate(params);
      if (error) throw error;

      return next();
    } catch (error) {
      next(error);
    }
  };

  return controller;
};
