import { Controller, Route, Get, Delete, Request, Middlewares, Post, Tags } from 'tsoa';

import type { AuthRequest } from '../../../middlewares/auth';
import { PaginationService } from '../../../utils/PaginationUtil';
import { ForbiddenError, NotFoundError } from '../../../errors/BasicError';
import { UserSanctionService } from './UserSanctionService';
import { UserService } from '../UserService';
import auth from '../../../middlewares/auth';
import { IUserSanctionModel } from '../../../models';
import { validate } from '../../../middlewares/validate';
import { UserSanctionCreateOneSchema, UserSanctionGetAllQuerySchema } from './UserSanctionSchema';

@Tags('users/{userId}/sanctions')
@Route('users/{userId}/sanctions')
export class UserSanctionController extends Controller {
  @Middlewares(validate(UserSanctionGetAllQuerySchema, ['query', 'body'], { allowPagination: true, allowScope: true }))
  @Middlewares(auth({ allowSelf: true, allowOnlyPermissions: ['user.sanction'] }))
  @Get()
  public async getAll(@Request() req: AuthRequest) {
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const user = await UserService.getOne(req.params.userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const results = await UserSanctionService.getAll(
      pagination,
      { ...params, userId: req.params.userId },
      { count: true, scope },
    );

    const data = results.data as IUserSanctionModel[];

    return { ...results, data };
  }

  @Middlewares(validate(null, ['body', 'query'], { allowScope: true }))
  @Middlewares(auth({ allowSelf: true, allowOnlyPermissions: ['user.sanction'] }))
  @Get('{sanctionId}')
  public async getOne(@Request() req: AuthRequest) {
    const scope = req.scope || null;
    const { sanctionId, userId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const data = await UserSanctionService.getOneByUserId(sanctionId, userId, { scope });
    if (!data) throw NotFoundError('sanction not found', { logit: false });

    return data as IUserSanctionModel;
  }

  @Middlewares(validate(UserSanctionCreateOneSchema))
  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction.create'] }))
  @Post()
  public async createOne(@Request() req: AuthRequest) {
    const { body, user } = req;

    const target = await UserService.getOne(req.params.userId);
    if (!target) throw NotFoundError('user not found', { logit: false });

    // can't sanction someone with a higher role than you
    if (target.isRoleHigherOrEqual(user.role)) throw ForbiddenError("you can't sanction this user", { logit: false });

    // can't sanction yourself
    if (target.id === user.id) throw ForbiddenError("you can't sanction yourself", { logit: false });

    // can't sanction someone who is already banned
    const isAlreadyBanned = await UserSanctionService.isAlreadySanctioned(target.id, ['BAN', 'TEMP_BAN']);
    if (isAlreadyBanned) throw ForbiddenError('this user is already banned', { logit: false });

    await UserSanctionService.createOne({ ...body, userId: target.id, byUserId: user.id });
  }

  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction.manage'] }))
  @Delete('{sanctionId}/cancel')
  public async cancelOne(@Request() req: AuthRequest) {
    const { sanctionId, userId } = req.params;

    const sanction = await UserSanctionService.getOneByUserId(sanctionId, userId);

    if (!sanction) throw NotFoundError('sanction not found', { logit: false });
    await UserSanctionService.cancelOne(sanction, req.body);
  }

  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction.remove'] }))
  @Delete('{sanctionId}')
  public async deleteOne(@Request() req: AuthRequest) {
    const { sanctionId, userId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    const sanction = await UserSanctionService.getOne(sanctionId);

    if (!sanction) throw NotFoundError('sanction not found', { logit: false });
    await UserSanctionService.deleteOne(sanction);
  }

  @Middlewares(auth({ allowOnlyPermissions: ['user.sanction.remove'] }))
  @Delete()
  public async clear(@Request() req: AuthRequest) {
    const { userId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    await UserSanctionService.clear(userId);
  }
}
