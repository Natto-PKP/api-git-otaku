import { Router } from 'express';

export const UserSanctionCommentRouter = Router({ mergeParams: true });

UserSanctionCommentRouter.get('/');

UserSanctionCommentRouter.get(':commentId');

UserSanctionCommentRouter.post('/');

UserSanctionCommentRouter.patch(':commentId');

UserSanctionCommentRouter.delete(':commentId');
