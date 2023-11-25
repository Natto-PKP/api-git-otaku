import { Controller, Route, Get, Patch, Delete, Request, Middlewares, Path, Tags } from 'tsoa';

import type { AuthRequest } from '../../middlewares/auth';
import { PaginationService } from '../../utils/PaginationUtil';
import { UserService } from './UserService';
import auth from '../../middlewares/auth';
import { NotFoundError } from '../../errors/BasicError';
import { UsernameRegex } from '../../models/User/UserUtils';
import { UserScopes } from '../../models/User/UserScopes';
import { IUserModel } from '../../models';
import { validate } from '../../middlewares/validate';
import { UserGetAllQuerySchema } from './UserSchema';
import { UserValidation } from './UserValidation';

const scopes = UserScopes;

@Tags('users')
@Route('users')
export class UserController extends Controller {
  /**
   * get all users with pagination and scope
   */
  @Middlewares(UserValidation.getAllQueryParams)
  @Middlewares(validate(UserGetAllQuerySchema, ['query', 'body'], { allowPagination: true, allowScope: true }))
  @Middlewares(auth({ required: false, scopes }))
  @Get()
  public async getAll(@Request() req: AuthRequest<false>) {
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;

    const results = await UserService.getAll(pagination, params, { count: true, scope });

    const data = results.data as IUserModel[];

    return { ...results, data };
  }

  /**
   * get specific user with scope
   * @param identifier user id, username or '@me' to get current user
   */
  @Middlewares(
    auth({
      required: false,
      scopes,
      allowSelf: true,
      allowMeParam: true,
      allowUserIdentifierParam: true,
      selfParamName: 'identifier',
    }),
  )
  @Get('{identifier}')
  public async getOne(@Request() req: AuthRequest<false>, @Path() identifier: string) {
    const scope = req.scope || null;

    let data = null;
    if (identifier === '@me' && req.user) data = await UserService.getOne(req.user.id, { scope }); // get current user
    else if (UsernameRegex.test(identifier)) {
      data = await UserService.getOneByUsername(identifier, { scope });
    } else data = await UserService.getOne(identifier, { scope }); // get user by id

    if (!data) throw NotFoundError('user not found', { logit: false });

    return data as IUserModel;
  }

  /**
   * delete specific user, only current user can delete himself
   */
  @Middlewares(auth({ allowOnlySelf: true }))
  @Delete('{userId}')
  public async deleteOne(@Request() req: AuthRequest) {
    const { userId } = req.params;

    const user = await UserService.getOne(userId);
    if (!user) throw NotFoundError('user not found', { logit: false });

    await UserService.deleteOne(user);
  }

  /**
   * update specific user, only current user can update himself, users with 'user.manage' permission can update other users
   */
  @Middlewares(UserValidation.updateOneBodyParams)
  @Middlewares(auth({ allowSelf: true, allowOnlyPermissions: ['user.manage'] }))
  @Patch('{userId}')
  public async updateOne(@Request() req: AuthRequest) {
    await UserService.updateOne(req.params.userId, req.body);
  }
}
