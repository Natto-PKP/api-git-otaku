import { Router } from 'express';
import { validate } from '../../../middlewares/validate';
import { handler } from '../../../helpers/handler';
import auth from '../../../middlewares/auth';
import { UserSanctionCreateOneSchema, UserSanctionGetAllQuerySchema } from './UserSanctionSchema';
import { UserSanctionController } from './UserSanctionController';
import { UserSanctionScopes } from '../../../models/User/Sanction/UserSanctionScopes';
import { UserSanctionCommentRouter } from './comments/UserSanctionCommentRouter';

export const UserSanctionRouter = Router({ mergeParams: true });

const scopes = UserSanctionScopes;

UserSanctionRouter.use('/:sanctionId/comments', UserSanctionCommentRouter);

UserSanctionRouter.get(
  '/',
  handler(auth({ allowOnlyPermissions: ['user.sanction'], allowSelf: true, scopes })),
  validate(UserSanctionGetAllQuerySchema, ['body', 'query'], { allowPagination: true, allowScope: true }),
  handler(UserSanctionController.getAll),
);

UserSanctionRouter.get(
  '/:sanctionId',
  handler(auth({ allowOnlyPermissions: ['user.sanction'], allowSelf: true, scopes })),
  validate(null, ['body', 'query'], { allowScope: true }),
  handler(UserSanctionController.getOne),
);

UserSanctionRouter.post(
  '/',
  handler(auth({ allowOnlyPermissions: ['user.sanction.create'] })),
  validate(UserSanctionCreateOneSchema, ['body']),
  handler(UserSanctionController.createOne),
);

UserSanctionRouter.delete(
  '/',
  handler(auth({ allowOnlyPermissions: ['user.sanction.remove'] })),
  handler(UserSanctionController.clear),
);

UserSanctionRouter.delete(
  '/:sanctionId',
  handler(auth({ allowOnlyPermissions: ['user.sanction.remove'] })),
  handler(UserSanctionController.deleteOne),
);

UserSanctionRouter.delete(
  '/:sanctionId/cancel',
  handler(auth({ allowOnlyPermissions: ['user.sanction.manage'] })),
  handler(UserSanctionController.cancelOne),
);
