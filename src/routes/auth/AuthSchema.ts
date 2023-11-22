import Joi from 'joi';
import { PasswordRegex, PseudoRegex, UsernameRegex } from '../../models/User/UserUtils';

/**
 * Auth login schema
 */
export const LoginSchema = Joi.object()
  .keys({
    email: Joi.string().email(),
    username: Joi.string().regex(UsernameRegex),
    password: Joi.string().regex(PasswordRegex).required(),
  })
  .length(2)
  .xor('email', 'username')
  .required();

/**
 * Auth register schema
 */
export const RegisterSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    username: Joi.string().regex(UsernameRegex).required(),
    password: Joi.string().regex(PasswordRegex).required(),
    pseudo: Joi.string().regex(PseudoRegex).required(),
    isPrivate: Joi.boolean().optional(),
  })
  .required();
