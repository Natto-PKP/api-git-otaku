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
    },
    roles: ['ADMIN', 'OWNER', 'HELPER'],
  },
};

export const ArticleScopes = new ScopeUtil(config);
