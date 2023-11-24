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

  static async isAlreadySanctioned(userId: string, type: IData['type'] | IData['type'][]) {
    const types = Array.isArray(type) ? type : [type];
    const typeIn = [] as string[];
    const where = { userId, type: { [Op.in]: typeIn } } as { [key: string | symbol]: unknown };

    if (types.includes('BAN')) typeIn.push('BAN');
    if (types.includes('TEMP_BAN')) {
      typeIn.push('TEMP_BAN');
      where.expireAt = { [Op.gt]: new Date() };
    }

    const sanction = await UserSanctionModel.findOne({ where });

    return !!sanction;
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
    const d = { ...data, isCancelled: true } as IData;

    if (typeof sanction === 'string') await UserSanctionModel.update(d, { where: { id: sanction } });
    else await UserSanctionModel.update(d, { where: { id: sanction.id } });
  }

  static async clear(userId: string) {
    await UserSanctionModel.destroy({ where: { userId } });
  }
}
