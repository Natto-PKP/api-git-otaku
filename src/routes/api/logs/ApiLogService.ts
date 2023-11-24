import { BasicError } from '../../../errors/BasicError';
import { AuthRequest } from '../../../middlewares/auth';
import { UserModel } from '../../../models';
import { ApiLogModel, type IApiLogModel } from '../../../models/Api/ApiLog/ApiLogModel';
import type { IPaginationFrom } from '../../../utils/PaginationUtil';
import { Scope } from '../../../utils/ScopeUtil';

// Types
type IData = Partial<IApiLogModel>;

interface GetAllQuery {
  type?: IData['type'] | null;
  status?: IData['status'] | null;
  code?: IData['code'] | null;
}

interface Options {
  scope?: Scope | null;
}

interface GetAllOptions extends Options {
  count?: boolean | null;
}

export class ApiLogService {
  /**
   * Create a new log
   * @param data
   * @returns
   */
  static async createOne(data: IData) {
    return ApiLogModel.create(data);
  }

  static async from(error: BasicError | Error, user?: UserModel | null, req?: AuthRequest<false> | null) {
    const base = {} as IData;
    base.url = req?.url || null;
    base.method = req?.method || null;
    base.params = req?.params || null;
    base.query = req?.query || null;
    base.body = req?.body || null;
    base.headers = req?.headers || null;
    base.createdById = user?.id || null;
    base.updatedById = user?.id || null;

    if (error instanceof BasicError) {
      const data = error.data as IData;
      return ApiLogService.createOne({ ...base, ...data });
    } else
      return ApiLogService.createOne({
        ...base,
        type: 'ERROR',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500,
        message: error.message,
        stack: error.stack,
      });
  }

  /**
   * Get all logs
   * @param pagination
   * @param query
   * @param options
   * @returns
   */
  static async getAll(pagination: IPaginationFrom, query: GetAllQuery, options?: GetAllOptions) {
    const scope = options?.scope || 'public';

    // build where clause
    const where = {} as { [key: string]: unknown };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.code) where.code = query.code;

    const data = await ApiLogModel.scope(scope).findAll({ where, ...pagination });

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
      const total = await ApiLogModel.count({ where });
      result.totalPage = Math.ceil(total / pagination.limit);
      result.total = total;
      result.currentPageSize = data.length;
    }

    return result;
  }

  /**
   * Get one log
   * @param id
   * @param options
   * @returns
   */
  static async getOne(id: string, options?: Options) {
    const scope = options?.scope || 'public';
    return ApiLogModel.scope(scope).findOne({ where: { id } });
  }

  /**
   * Delete one log
   * @param log
   */
  static async deleteOne(log: string | ApiLogModel | IApiLogModel) {
    const id = typeof log === 'string' ? log : log.id;
    await ApiLogModel.destroy({ where: { id } });
  }
}
