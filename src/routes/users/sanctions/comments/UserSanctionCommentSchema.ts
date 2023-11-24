import Joi from 'joi';

export const UserSanctionCommentCreateOneSchema = Joi.object().keys({
  content: Joi.string().required(),
});

export const UserSanctionCommentUpdateOneSchema = Joi.object().keys({
  content: Joi.string().required(),
});
