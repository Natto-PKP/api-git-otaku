import { Router } from 'express';
import { handler } from '../../helpers/handler';
import { validate } from '../../middlewares/validate';
import { ArticleGetAllQuerySchema } from './ArticleSchema';
import auth from '../../middlewares/auth';

export const ArticleRouter = Router(); 

ArticleRouter.get(
  '/',
  handler(auth({ required: false, ignoreBannedUser: true, ignoreBlockedUser: true })),
  validate(ArticleGetAllQuerySchema, ['body', 'query']),
);

ArticleRouter.post(
  '/',
  handler(auth()),
);

ArticleRouter.get(
  '/:id',
  handler(auth({ required: false, ignoreBannedUser: true, ignoreBlockedUser: true })),
);

ArticleRouter.patch(
  '/:id',
);

ArticleRouter.delete(
  '/:id',
);
