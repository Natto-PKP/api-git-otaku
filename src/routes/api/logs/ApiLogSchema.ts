import Joi from 'joi';
import { ErrorCodeNames, ErrorTypes } from '../../../errors/BaseError';

/**
 * ApiLog get all query schema
 */
export const ApiLogGetAllQuerySchema = Joi.object().keys({
  type: Joi.string()
    .valid(...ErrorTypes)
    .optional(),
  status: Joi.number().integer().positive().optional(),
  code: Joi.string()
    .valid(...ErrorCodeNames)
    .optional(),
});
