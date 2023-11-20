import Joi from 'joi';
import {
  PasswordRegex,
  PseudoRegex, 
  UserRoles,
  UsernameRegex,
} from '../../models/User/UserUtils'; 
     
/**
 * User get all query schema 
 */
export const UserGetAllQuerySchema = Joi.object({
  role: Joi.string().valid(...UserRoles).optional(), 
  isVerified: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional(),
  isBanned: Joi.boolean().optional(),
  search: Joi.string().optional(),
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().optional(),
  offset: Joi.number().integer().positive().optional(),
});

/**
 * User self update body schema
 */
export const UserSelfUpdateBodySchema = Joi.object({
  username: Joi.string().regex(UsernameRegex).optional(),
  pseudo: Joi.string().regex(PseudoRegex).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().regex(PasswordRegex).optional(),
  isPrivate: Joi.boolean().optional(),
}).required();

/**
 * User admin update body schema
 */
export const UserAdminUpdateBodySchema = Joi.object({
  username: Joi.string().regex(UsernameRegex).optional(),
  pseudo: Joi.string().regex(PseudoRegex).optional(),
  role: Joi.string().valid(...UserRoles).optional(),
  isPrivate: Joi.boolean().optional(),
}).required();
