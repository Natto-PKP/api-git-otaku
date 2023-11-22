import { Op } from 'sequelize';
import { ArticleModel, type IArticleModel } from '../../models/Article/ArticleModel';
import type { IPaginationFrom } from '../../utils/PaginationUtil';
import { Scope } from '../../utils/ScopeUtil';

type IData = Partial<IArticleModel>;

interface GetAllQuery {
  type?: IData['type'] | null;
  visibility?: IData['visibility'] | null;
  status?: IData['status'] | null;
  search?: string | null;
}

interface Options {
  /**
   * @default UserDefaultScopeName 'public'
   */
  scope?: Scope | null;
}

interface GetAllOptions extends Options {
  /**
   * @default false
   */
  count?: boolean | null;
}

export class ArticleService {
  /**
   * Create a new article
   * @param data
   * @returns
   */
  static async createOne(data: IData) {
    return ArticleModel.create(data);
  }

  /**
   * Get all articles
   * @param pagination
   * @param query
   * @param options
   * @returns
   */
  static async getAll(pagination: IPaginationFrom, query: GetAllQuery, options?: GetAllOptions) {
    const scope = options?.scope || 'public'; // get scope

    // build where clause
    const where = {} as { [key: string | symbol]: unknown };
    if (query.type) where.type = query.type;
    if (query.visibility) where.systemStatus = query.visibility;
    if (query.status) where.status = query.status;

    if (query.search) {
      where[Op.or] = {
        title: { [Op.iLike]: `%${query.search}%` },
        // aliases: { [Op.iLike]: `%${query.search}%` },
      };
    }

    // get data
    const data = await ArticleModel.scope(scope).findAll({ where, ...pagination });

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
      const count = await ArticleModel.scope(scope).count({ where });
      result.total = count;
      result.totalPage = Math.ceil(count / pagination.limit);
      result.currentPageSize = data.length;
    }

    return result; // return result
  }

  /**
   * Get one article
   * @param identifier
   * @param options
   * @returns
   */
  static async getOne(identifier: string, options?: Options) {
    const scope = options?.scope || 'public';
    return ArticleModel.scope(scope).findOne({ where: { identifier } });
  }

  /**
   * Delete one article
   * @param article
   */
  static async deleteOne(article: string | ArticleModel | IArticleModel) {
    if (typeof article === 'string') await ArticleModel.destroy({ where: { id: article } });
    else await ArticleModel.destroy({ where: { id: article.id } });
  }

  /**
   * Update one article
   * @param article
   * @param data
   */
  static async updateOne(article: string | ArticleModel | IArticleModel, data: IData) {
    if (typeof article === 'string') await ArticleModel.update(data, { where: { id: article } });
    else await ArticleModel.update(data, { where: { id: article.id } });
  }
}
