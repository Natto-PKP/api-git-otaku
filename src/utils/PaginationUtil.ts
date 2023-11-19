import Joi from 'joi';

// Magic numbers
const MIN_LIMIT = 0;
const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 100;

// Schemas
const PaginationLimitSchema = Joi.number().min(MIN_LIMIT).max(MAX_LIMIT);

export const PaginationQuery = Joi.alternatives(
  Joi.object().keys({
    limit: PaginationLimitSchema,
    page: Joi.number().min(0),
  }).unknown(true),
  Joi.object().keys({
    limit: PaginationLimitSchema,
    offset: Joi.number().min(0),
  }).unknown(true),
);

// Types
export type IPagination = ({ offset: number } | { page: number }) & { limit: number };
export type IPaginationFrom = { offset: number, limit: number, page: number };

/**
 * Pagination service
 * @description Service to handle pagination
 */
export default class PaginationService {
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
    return page * limit;
  }

  /**
   * Get pagination from query
   * @param pagination
   * @returns
   */
  static from(pagination?: Partial<IPagination>): IPaginationFrom {
    if (pagination) { // if pagination is defined
      const limit = PaginationService.getLimit(pagination.limit);

      if ('offset' in pagination) { // if offset is defined, then calculate from offset
        const offset = PaginationService.getOffset(pagination.offset);
        const page = Math.floor(offset / limit);
        return { offset, limit, page };
      }

      // else caculate from page
      const page = PaginationService.getPage('page' in pagination ? pagination.page : 0);
      const offset = PaginationService.calcOffset(page, limit);
      return { offset, limit, page };
    } return { offset: 0, limit: DEFAULT_LIMIT, page: 0 }; // else return default pagination
  }
}
