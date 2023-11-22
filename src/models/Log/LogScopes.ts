import { ScopeUtil, Scopes } from '../../utils/ScopeUtil';

const config: Scopes = {
  public: {
    options: {
      attributes: { exclude: ['stack', 'headers'] },
    },
  },

  internal: {
    options: {
      attributes: { exclude: ['stack', 'headers'] },
    },
  },
};

export const LogScopes = new ScopeUtil(config);
