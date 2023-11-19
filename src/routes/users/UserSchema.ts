import Joi from 'joi';
import { UserRoles } from '../../models/User/UserUtils';

/**
 * User get all query schema
 */
export const UserGetAllQuerySchema = Joi.object({
  role: Joi.string().valid(...UserRoles).optional(),
  isVerified: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional(),
  isBanned: Joi.boolean().optional(),
  search: Joi.string().optional(),
});

/**
 * User self update body schema
 */
export const UserSelfUpdateBodySchema = Joi.object({
  username: Joi.string().optional(),
  pseudo: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  isPrivate: Joi.boolean().optional(),
}).required();

/**
 * User admin update body schema
 */
export const UserAdminUpdateBodySchema = Joi.object({
  username: Joi.string().optional(),
  pseudo: Joi.string().optional(),
  role: Joi.string().valid(...UserRoles).optional(),
  isPrivate: Joi.boolean().optional(),
}).required();
