import Joi from 'joi';
import { ArticleStatuses, ArticleTypes, ArticleVisibilities } from '../../models/Article/ArticleUtils';

/**
 * Article get all query schema
 */
export const ArticleGetAllQuerySchema = Joi.object().keys({
  type: Joi.string()
    .valid(...ArticleTypes)
    .optional(),
  status: Joi.string()
    .valid(...ArticleStatuses)
    .optional(),
  visibility: Joi.string()
    .valid(...ArticleVisibilities)
    .optional(),
  search: Joi.string().optional(),
});

const Body = {
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  type: Joi.string()
    .valid(...ArticleTypes)
    .optional(),
  status: Joi.string()
    .valid(...ArticleStatuses)
    .optional(),
  aliases: Joi.array()
    .items(Joi.string().not(Joi.ref('title')))
    .optional(),
  description: Joi.string().optional(),
  synopsis: Joi.string().optional(),
  // if status is not PENDING, then beginAt can be defined
  beginAt: Joi.alternatives().conditional('status', {
    is: Joi.string().not('PENDING'),
    then: Joi.date().optional(),
    otherwise: Joi.forbidden(),
  }),
  // if status is FINISHED, then endAt can be defined
  endAt: Joi.alternatives().conditional('status', {
    is: 'FINISHED',
    then: Joi.date().optional(),
    otherwise: Joi.forbidden(),
  }),
  // if type is MANGA, NOVEL, WEBTOON, then volumes and chapters can be defined
  volumes: Joi.alternatives().conditional('type', {
    is: Joi.string().valid('MANGA', 'NOVEL', 'WEBTOON'),
    then: Joi.number().integer().positive().optional(),
    otherwise: Joi.forbidden(),
  }),
  chapters: Joi.alternatives().conditional('type', {
    is: Joi.string().valid('MANGA', 'NOVEL', 'WEBTOON'),
    then: Joi.number().integer().positive().optional(),
    otherwise: Joi.forbidden(),
  }),
  // if type is ANIME, SERIE, then episodes and seasons can be defined
  episodes: Joi.alternatives().conditional('type', {
    is: Joi.string().valid('ANIME', 'SERIE'),
    then: Joi.number().integer().positive().optional(),
    otherwise: Joi.forbidden(),
  }),
  seasons: Joi.alternatives().conditional('type', {
    is: Joi.string().valid('ANIME', 'SERIE'),
    then: Joi.number().integer().positive().optional(),
    otherwise: Joi.forbidden(),
  }),
  duration: Joi.number().integer().positive().optional(),
  // if status is CANCELLED, then canceledAt can be defined
  canceledAt: Joi.alternatives().conditional('status', {
    is: 'CANCELLED',
    then: Joi.date().optional(),
    otherwise: Joi.forbidden(),
  }),
};

const CreateBody = {
  ...Body,
  title: Joi.string().required(),
};

/**
 * Article   create body schema
 */
export const ArticleCreateBodySchema = Joi.object()
  .keys({
    ...CreateBody,
    visibility: Joi.forbidden(),
  })
  .required();

/**
 * Article helper create body schema
 */
export const ArticleHelperCreateBodySchema = Joi.object()
  .keys({
    ...CreateBody,
    visibility: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  })
  .required();

/**
 * Article update body schema
 */
export const ArticleUpdateBodySchema = Joi.object()
  .keys({
    ...Body,
    visibility: Joi.forbidden(),
  })
  .required();

/**
 * Article helper update body schema
 */
export const ArticleHelperUpdateBodySchema = Joi.object()
  .keys({
    ...Body,
    visibility: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  })
  .required();
