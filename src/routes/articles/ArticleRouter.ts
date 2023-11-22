import { Router } from 'express';
import { handler } from '../../helpers/handler';
import { validate } from '../../middlewares/validate';
import { ArticleGetAllQuerySchema } from './ArticleSchema';
import auth from '../../middlewares/auth';
import { ArticleScopes } from '../../models/Article/ArticleScopes';

export const ArticleRouter = Router();

ArticleRouter.get(
  '/',
  handler(auth({ required: false, ignoreScanctionedUser: true, scopes: ArticleScopes })),
  validate(ArticleGetAllQuerySchema, ['body', 'query'], { allowPagination: true, allowScope: true }),
);

ArticleRouter.post('/', handler(auth()));

ArticleRouter.get(
  '/:articleId',
  handler(auth({ required: false, ignoreScanctionedUser: true, scopes: ArticleScopes })),
  validate(null, ['body', 'query'], { allowScope: true }),
);

ArticleRouter.patch('/:articleId');

ArticleRouter.delete('/:articleId');
