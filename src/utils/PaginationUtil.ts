import Joi from 'joi';

// Magic numbers
export const MIN_LIMIT = 0;
export const MAX_LIMIT = 200;
export const DEFAULT_LIMIT = 100;

// Types
export type IPagination = { page: number; limit: number };
export type IPaginationFrom = { offset: number; limit: number; page: number };

export const PaginationSchemaData = {
  page: Joi.number().integer().positive().allow(0),
  limit: Joi.number().integer().positive(),
};

/**
 * Pagination service
 * @description Service to handle pagination
 */
export class PaginationService {
  /**
   * Get limit
   * @param limit
   * @param min
   * @param max
   * @returns
   */
  static getLimit(limit = DEFAULT_LIMIT, min = MIN_LIMIT, max = MAX_LIMIT) {
    if (limit < min) return min;
    if (limit > max) return max;
    return limit;
  }

  /**
   * Get page
   * @param page
   * @returns
   */
  static getPage(page = 0) {
    return page < 0 ? 0 : page;
  }

  /**
   * Get offset
   * @param offset
   * @returns
   */
  static getOffset(offset = 0) {
    return offset < 0 ? 0 : offset;
  }

  /**
   * Calculate offset from page and limit
   * @param page
   * @param limit
   * @returns
   */
  static calcOffset(page: number, limit: number) {
    const l = PaginationService.getLimit(limit);
    const p = PaginationService.getPage(page);
    return p * l;
  }

  /**
   * Get pagination from query
   * @param pagination
   * @returns
   */
  static from(pagination?: Partial<IPagination>): IPaginationFrom {
    if (pagination) {
      const limit = PaginationService.getLimit(pagination.limit);
      const page = PaginationService.getPage(pagination.page || 0);
      const offset = PaginationService.calcOffset(page, limit);
      return { offset, limit, page };
    }

    return { offset: 0, limit: DEFAULT_LIMIT, page: 0 }; // else return default pagination
  }
}
