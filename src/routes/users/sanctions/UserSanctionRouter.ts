import { Router } from 'express';
import { validate } from '../../../middlewares/validate';
import { handler } from '../../../helpers/handler';
import auth from '../../../middlewares/auth';
import { UserSanctionCreateOneSchema, UserSanctionGetAllQuerySchema } from './UserSanctionSchema';
import { UserSanctionController } from './UserSanctionController';
import { UserSanctionScopes } from '../../../models/User/Sanction/UserSanctionScopes';

export const UserSanctionRouter = Router({ mergeParams: true });

UserSanctionRouter.get(
  '/',
  handler(auth({ allowOnlyAdminOrHigher: true, allowOnlySelf: true, scopes: UserSanctionScopes })),
  validate(UserSanctionGetAllQuerySchema, ['body', 'query'], { allowPagination: true, allowScope: true }),
  handler(UserSanctionController.getAll),
);

UserSanctionRouter.get(
  '/:sanctionId',
  handler(auth({ allowOnlyAdminOrHigher: true, allowOnlySelf: true, scopes: UserSanctionScopes })),
  validate(null, ['body', 'query'], { allowScope: true }),
  handler(UserSanctionController.getOne),
);

UserSanctionRouter.post(
  '/',
  handler(auth({ allowOnlyAdminOrHigher: true })),
  validate(UserSanctionCreateOneSchema, ['body']),
  handler(UserSanctionController.createOne),
);

// cancel a sanction, don't delete it
UserSanctionRouter.delete(
  '/:sanctionId',
  handler(auth({ allowOnlyAdminOrHigher: true })),
  handler(UserSanctionController.cancelOne),
);
