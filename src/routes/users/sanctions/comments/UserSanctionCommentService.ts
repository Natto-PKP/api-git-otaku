import {
  UserSanctionCommentModel,
  IUserSanctionCommentModel,
} from '../../../../models/User/Sanction/Comment/UserSanctionCommentModel';
import { IPaginationFrom } from '../../../../utils/PaginationUtil';
import { Scope } from '../../../../utils/ScopeUtil';

type IData = Partial<IUserSanctionCommentModel>;

interface GetAllQuery {
  sanctionId?: IData['sanctionId'] | null;
}

interface Options {
  scope?: Scope | null;
}

interface GetAllOptions extends Options {
  count?: boolean | null;
}

export class UserSanctionCommentService {
  static async createOne(data: IData) {
    return UserSanctionCommentModel.create(data);
  }

  static async getAll(pagination: IPaginationFrom, query: GetAllQuery, options?: GetAllOptions) {
    const scope = options?.scope || 'public'; // get scope

    // build where clause
    const where = {} as { [key: string | symbol]: unknown };
    if (query.sanctionId) where.sanctionId = query.sanctionId;

    // get data
    const data = await UserSanctionCommentModel.scope(scope).findAll({ where, ...pagination });

    // build result
    const result = {
      data,
      currentPage: pagination.page,
      totalPage: null as number | null,
      total: null as number | null,
      currentPageSize: null as number | null,
      limit: pagination.limit,
    };

    if (options?.count) {
      // if count is true
      const total = await UserSanctionCommentModel.count({ where });
      result.totalPage = Math.ceil(total / pagination.limit);
      result.total = total;
      result.currentPageSize = data.length;
    }

    return result; // return result
  }

  static async getOne(id: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserSanctionCommentModel.scope(scope).findByPk(id);
  }

  static async updateOne(
    comment: string | UserSanctionCommentModel | IUserSanctionCommentModel,
    data: IData,
    options?: Options,
  ) {
    const scope = options?.scope || 'public';
    const commentId = typeof comment === 'string' ? comment : comment.id;
    return UserSanctionCommentModel.scope(scope).update(data, { where: { id: commentId } });
  }

  static async deleteOne(comment: string | UserSanctionCommentModel | IUserSanctionCommentModel) {
    const commentId = typeof comment === 'string' ? comment : comment.id;
    return UserSanctionCommentModel.destroy({ where: { id: commentId } });
  }

  static async deleteAllBysanctionId(sanctionId: string) {
    return UserSanctionCommentModel.destroy({ where: { sanctionId } });
  }

  static async deleteAllBySenderId(senderId: string) {
    return UserSanctionCommentModel.destroy({ where: { senderId } });
  }
}
