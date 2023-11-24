import Joi from 'joi';
import { PasswordRegex, PseudoRegex, UserRoleList, UsernameRegex } from '../../models/User/UserUtils';

export const UserGetAllQuerySchema = Joi.object().keys({
  role: Joi.string()
    .valid(...UserRoleList)
    .optional(),
  isVerified: Joi.boolean().optional(),
  search: Joi.string().optional(),
});

export const UserUpdateBodySchema = Joi.object().keys({
  username: Joi.string().regex(UsernameRegex).optional(),
  pseudo: Joi.string().regex(PseudoRegex).optional(),
  role: Joi.string()
    .valid(...UserRoleList)
    .optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().regex(PasswordRegex).optional(),
  isPrivate: Joi.boolean().optional(),
});
