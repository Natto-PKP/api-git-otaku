import { Controller, Route, Get, Delete, Request, Middlewares, Post, Patch, Tags } from 'tsoa';

import type { AuthRequest } from '../../../../middlewares/auth';
import { PaginationService } from '../../../../utils/PaginationUtil';
import { ForbiddenError, NotFoundError } from '../../../../errors/BasicError';
import { UserSanctionCommentService } from './UserSanctionCommentService';
import { IUserSanctionCommentModel } from '../../../../models';
import auth from '../../../../middlewares/auth';
import { validate } from '../../../../middlewares/validate';
import { UserSanctionCommentCreateOneSchema } from './UserSanctionCommentSchema';
import { UserSanctionService } from '../UserSanctionService';
import { UserService } from '../../UserService';

@Tags('users/{userId}/sanctions/{sanctionId}/comments')
@Route('users/{userId}/sanctions/{sanctionId}/comments')
export class UserSanctionCommentController extends Controller {
  @Middlewares(validate(null, ['body', 'query'], { allowPagination: true, allowScope: true }))
  @Middlewares(auth({ allowSelf: true, allowOnlyPermissions: ['user.sanction'] }))
  @Get()
  public async getAll(@Request() req: AuthRequest) {
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;
    const { userId, sanctionId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);
    if (!sanction) throw NotFoundError('sanction not found', { logit: false });

    const results = await UserSanctionCommentService.getAll(pagination, { sanctionId }, { count: true, scope });

    const data = results.data as IUserSanctionCommentModel[];

    return { ...results, data };
  }

  @Middlewares(validate(null, ['body', 'query'], { allowScope: true }))
  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction'] }))
  @Get('{commentId}')
  public async getOne(@Request() req: AuthRequest) {
    const scope = req.scope || null;
    const { commentId, userId, sanctionId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);
    if (!sanction) throw NotFoundError('sanction not found', { logit: false });

    const data = await UserSanctionCommentService.getOne(commentId, { scope });
    if (!data) throw NotFoundError('comment not found', { logit: false });

    return data as IUserSanctionCommentModel;
  }

  @Middlewares(validate(UserSanctionCommentCreateOneSchema))
  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction'] }))
  @Post()
  public async createOne(@Request() req: AuthRequest) {
    const { userId, sanctionId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);
    if (!sanction) throw NotFoundError('sanction not found', { logit: false });

    const body = {
      content: req.body.content,
      senderId: req.user.id,
      sanctionId: req.params.sanctionId,
      createdById: req.user.id,
      updatedById: req.user.id,
    };

    await UserSanctionCommentService.createOne(body);
  }

  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction'] }))
  @Patch('{commentId}')
  public async updateOne(@Request() req: AuthRequest) {
    const { commentId, userId, sanctionId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);
    if (!sanction) throw NotFoundError('sanction not found', { logit: false });

    const comment = await UserSanctionCommentService.getOne(commentId);
    if (!comment) throw NotFoundError('comment not found', { logit: false });
    if (comment.senderId !== req.user.id) throw ForbiddenError("can't edit this comment", { logit: false });

    const body = { ...req.body, edited: true, updatedById: req.user.id };
    await UserSanctionCommentService.updateOne(commentId, body);
  }

  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction'] }))
  @Delete('{commentId}')
  public async deleteOne(@Request() req: AuthRequest) {
    const { commentId, userId, sanctionId } = req.params;
    const user = req.user;

    const target = await UserService.getOne(userId);
    if (!target) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);
    if (!sanction) throw NotFoundError('sanction not found', { logit: false });

    const comment = await UserSanctionCommentService.getOne(commentId);
    if (!comment) throw NotFoundError('comment not found', { logit: false });

    if (comment.senderId !== user.id && !user.hasPermissions('user.sanction.remove'))
      throw ForbiddenError("can't delete this comment", { logit: false });

    await UserSanctionCommentService.deleteOne(commentId);
  }
}
