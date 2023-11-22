import { Op } from 'sequelize';
import { ScopeUtil, Scopes } from '../../utils/ScopeUtil';

export const config: Scopes = {
  public: {
    options: {
      attributes: { exclude: ['updatedById', 'createdById'] },
      where: { systemStatus: 'PUBLISHED' },
    },
  },

  internal: {
    options: {
      attributes: { exclude: ['updatedById', 'createdById'] },
      where: { systemStatus: { [Op.in]: ['PUBLISHED', 'DRAFT', 'SUGGESTED'] } },
    },
  },

  private: {
    options: {
      attributes: { exclude: ['updatedById', 'createdById'] },
    },
  },
};

export const ArticleScopes = new ScopeUtil(config);
