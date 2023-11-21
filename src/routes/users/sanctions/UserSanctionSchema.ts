import Joi from 'joi';
import { UserSanctionTypes } from '../../../models/User/Sanction/UserSanctionUtils';

export const UserSanctionGetAllQuerySchema = Joi.object({
  userId: Joi.string().uuid(),
  type: Joi.string().valid(...UserSanctionTypes),
  askCancellation: Joi.boolean(),
  isCancelled: Joi.boolean(),
  byUserId: Joi.string().uuid(),
  page: Joi.number().integer().positive().allow(0),
  limit: Joi.number().integer().positive(),
});

export const UserSanctionCreateOneSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  reason: Joi.string().required(),
  type: Joi.string()
    .valid(...UserSanctionTypes)
    .required(),
  endDate: Joi.date().allow(null),
});
