import { Op, type FindOptions } from 'sequelize';
import type { BaseScope } from '../../middlewares/auth';

export const ArticleScopes: { [key in BaseScope]: FindOptions } = {
  public: {
    attributes: { exclude: ['updatedById', 'createdById'] },
    where: { systemStatus: 'PUBLISHED' },
  },

  internal: {
    attributes: { exclude: ['updatedById', 'createdById'] },
    where: { systemStatus: { [Op.in]: ['PUBLISHED', 'DRAFT', 'SUGGESTED'] } },
  },

  private: {
    attributes: { exclude: ['updatedById', 'createdById'] },
  },

  system: {

  },
};

export type ArticleScope = keyof typeof ArticleScopes;

export default ArticleScopes.public;
