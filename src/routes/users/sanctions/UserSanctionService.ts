import { UserSanctionModel, IUserSanctionModel } from '../../../models';
import { IPaginationFrom } from '../../../utils/PaginationUtil';
import { Op } from 'sequelize';
import { Scope } from '../../../utils/ScopeUtil';

type IData = Partial<IUserSanctionModel>;

interface GetAllQuery {
  userId?: IData['userId'] | null;
  type?: IData['type'] | null;
  askCancellation?: IData['askCancellation'] | null;
  isCancelled?: IData['isCancelled'] | null;
  byUserId?: IData['byUserId'] | null;
}

interface Options {
  scope?: Scope | null;
}

interface GetAllOptions extends Options {
  count?: boolean | null;
}

export class UserSanctionService {
  static async createOne(data: IData) {
    return UserSanctionModel.create(data);
  }

  static async getAll(pagination: IPaginationFrom, query: GetAllQuery, options?: GetAllOptions) {
    const scope = options?.scope || 'public'; // get scope

    // build where clause
    const where = {} as { [key: string | symbol]: unknown };
    if (query.userId) where.userId = query.userId;
    if (query.type) where.type = query.type;
    if (query.askCancellation) where.askCancellation = query.askCancellation;
    if (query.isCancelled) where.isCancelled = query.isCancelled;
    if (query.byUserId) where.byUserId = query.byUserId;

    // get data
    const data = await UserSanctionModel.scope(scope).findAll({ where, ...pagination });

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
      const total = await UserSanctionModel.count({ where });
      result.totalPage = Math.ceil(total / pagination.limit);
      result.total = total;
      result.currentPageSize = data.length;
    }

    return result; // return result
  }

  static async getOne(id: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserSanctionModel.scope(scope).findByPk(id);
  }

  static async getOneByUserId(id: string, userId: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserSanctionModel.scope(scope).findOne({ where: { id, userId } });
  }

  static async deleteOne(sanction: string | UserSanctionModel | IUserSanctionModel) {
    if (typeof sanction === 'string') await UserSanctionModel.destroy({ where: { id: sanction } });
    else await UserSanctionModel.destroy({ where: { id: sanction.id } });
  }

  static async updateOne(sanction: string | UserSanctionModel | IUserSanctionModel, data: IData) {
    if (typeof sanction === 'string') await UserSanctionModel.update(data, { where: { id: sanction } });
    else await UserSanctionModel.update(data, { where: { id: sanction.id } });
  }

  static async cancelOne(
    sanction: string | UserSanctionModel | IUserSanctionModel,
    data: Pick<IData, 'cancelledReason' | 'cancelledByUserId'>,
  ) {
    const d = { ...data, isCancelled: true, cantCancel: true } as IData;

    if (typeof sanction === 'string') await UserSanctionModel.update(d, { where: { id: sanction } });
    else await UserSanctionModel.update(d, { where: { id: sanction.id } });
  }

  static async finishOne(sanction: string | UserSanctionModel | IUserSanctionModel) {
    const d = { isFinished: true, cantCancel: true } as IData;

    if (typeof sanction === 'string') await UserSanctionModel.update(d, { where: { id: sanction } });
    else await UserSanctionModel.update(d, { where: { id: sanction.id } });
  }

  static async finishAllWhoExpired() {
    const now = new Date();

    await UserSanctionModel.update(
      { isFinished: true, cantCancel: true },
      { where: { isFinished: false, expireAt: { [Op.lte]: now } } },
    );
  }
}
