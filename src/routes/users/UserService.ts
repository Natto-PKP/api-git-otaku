import { Op } from 'sequelize';
import { UserModel, type IUserModel } from '../../models/User/UserModel';
import type { IPaginationFrom } from '../../utils/PaginationUtil';
import type { UserScope } from '../../models/User/UserScopes';

// Types
type IData = Partial<IUserModel>;

interface GetAllQuery {
  role?: IData['role'] | null;
  isVerified?: IData['isVerified'] | null;
  search?: string | null;
}

interface Options {
  /**
   * @default UserDefaultScopeName 'public'
   */
  scope?: UserScope | null;
}

interface GetAllOptions extends Options {
  /**
   * @default false
   */
  count?: boolean | null;
}

/**
 * User service
 */
export class UserService {
  /**
   * Create a new user
   * @param data
   * @returns
   */
  static async createOne(data: IData) {
    return UserModel.create(data);
  }

  /**
   * Get all users
   * @param pagination
   * @param query
   * @param options
   * @returns
   */
  static async getAll(pagination: IPaginationFrom, query: GetAllQuery, options?: GetAllOptions) {
    const scope = options?.scope || 'public'; // get scope

    // build where clause
    const where = {} as { [key: string | symbol]: unknown };
    if (query.role) where.role = query.role;
    if (query.isVerified) where.isVerified = query.isVerified;

    if (query.search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${query.search}%` } },
        { pseudo: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    // get data
    const data = await UserModel.scope(scope).findAll({ where, ...pagination });

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
      const total = await UserModel.count({ where });
      result.totalPage = Math.ceil(total / pagination.limit);
      result.total = total;
      result.currentPageSize = data.length;
    }

    return result; // return result
  }

  /**
   * Get one user
   * @param id
   * @param options
   * @returns
   */
  static async getOne(id: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserModel.scope(scope).findOne({ where: { id } });
  }

  /**
   * Get one user by username or email
   * @param username
   * @param email
   * @param options
   * @returns
   */
  static async getOneByUsernameOrEmail(username: string, email: string, options?: Options) {
    const scope = options?.scope || 'public'; // get scope

    // build or clause
    const or = [];
    if (username) or.push({ username });
    if (email) or.push({ email });

    return UserModel.scope(scope).findOne({ where: { [Op.or]: or } }); // return result
  }

  /**
   * Get one user by username
   * @param username
   * @param options
   * @returns
   */
  static async getOneByUsername(username: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserModel.scope(scope).findOne({ where: { username } });
  }

  /**
   * Get one user by email
   * @param email
   * @param options
   * @returns
   */
  static async getOneByEmail(email: string, options?: Options) {
    const scope = options?.scope || 'public';
    return UserModel.scope(scope).findOne({ where: { email } });
  }

  /**
   * Delete one user
   * @param user
   */
  static async deleteOne(user: string | UserModel | IUserModel) {
    if (typeof user === 'string') await UserModel.destroy({ where: { id: user } });
    else await UserModel.destroy({ where: { id: user.id } });
  }

  /**
   * Update one user
   * @param user
   * @param data
   */
  static async updateOne(user: string | UserModel | IUserModel, data: IData) {
    if (typeof user === 'string') await UserModel.update(data, { where: { id: user } });
    else await UserModel.update(data, { where: { id: user.id } });
  }
}
