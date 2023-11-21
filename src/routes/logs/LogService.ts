import { LogModel, type ILogModel } from '../../models/Log/LogModel';
import type { IPaginationFrom } from '../../utils/PaginationUtil';
import type { LogScope } from '../../models/Log/LogScopes';

// Types
type IData = Partial<ILogModel>;

interface GetAllQuery {
  type?: IData['type'] | null;
  status?: IData['status'] | null;
  code?: IData['code'] | null;
}

interface Options {
  scope?: LogScope | null;
}

interface GetAllOptions extends Options {
  count?: boolean | null;
}

/**
 * Log service
 */
export class LogService {
  /**
   * Create a new log
   * @param data
   * @returns
   */
  static async createOne(data: IData) {
    return LogModel.create(data);
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

    const data = await LogModel.scope(scope).findAll({ where, ...pagination });

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
      const total = await LogModel.count({ where });
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
    return LogModel.scope(scope).findOne({ where: { id } });
  }

  /**
   * Delete one log
   * @param log
   */
  static async deleteOne(log: string | LogModel | ILogModel) {
    const id = typeof log === 'string' ? log : log.id;
    await LogModel.destroy({ where: { id } });
  }
}
