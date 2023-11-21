import { Router } from 'express';
import { validate } from '../../../middlewares/validate';
import { handler } from '../../../helpers/handler';
import auth from '../../../middlewares/auth';
import { UserSanctionCreateOneSchema, UserSanctionGetAllQuerySchema } from './UserSanctionSchema';
import { UserSanctionController } from './UserSanctionController';

export const UserSanctionRouter = Router({ mergeParams: true });

UserSanctionRouter.get(
  '/',
  handler(auth({ adminOnly: true })),
  validate(UserSanctionGetAllQuerySchema, ['body', 'query']),
  handler(UserSanctionController.getAll),
);

UserSanctionRouter.get('/:sanctionId', handler(auth({ adminOnly: true })), handler(UserSanctionController.getOne));

UserSanctionRouter.post(
  '/',
  handler(auth({ adminOnly: true })),
  validate(UserSanctionCreateOneSchema, ['body']),
  handler(UserSanctionController.createOne),
);

// cancel a sanction, don't delete it
UserSanctionRouter.delete(
  '/:sanctionId',
  handler(auth({ adminOnly: true })),
  handler(UserSanctionController.cancelOne),
);
