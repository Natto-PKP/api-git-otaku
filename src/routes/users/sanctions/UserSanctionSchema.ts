import Joi from 'joi';
import { UserSanctionTypes } from '../../../models/User/Sanction/UserSanctionUtils';

export const UserSanctionGetAllQuerySchema = Joi.object().keys({
  type: Joi.string().valid(...UserSanctionTypes),
  askCancellation: Joi.boolean(),
  isCancelled: Joi.boolean(),
});

export const UserSanctionCreateOneSchema = Joi.object().keys({
  reason: Joi.string().required(),
  type: Joi.string()
    .valid(...UserSanctionTypes)
    .required(),
  expireAt: Joi.alternatives().conditional('type', {
    is: 'TEMP_BAN',
    then: Joi.date().required(),
    otherwise: Joi.date().forbidden(),
  }),
});
