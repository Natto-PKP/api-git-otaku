import Joi from 'joi';
import { ErrorCodeNames, ErrorTypes } from '../../errors/BaseError';

/**
 * Log get all query schema
 */
export const LogGetAllQuerySchema = Joi.object({
  type: Joi.string().valid(...ErrorTypes).optional(),
  status: Joi.number().integer().positive().optional(),
  code: Joi.string().valid(...ErrorCodeNames).optional(),
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().optional(),
  offset: Joi.number().integer().positive().optional(),
});
