import { ScopeUtil, Scopes } from '../../../utils/ScopeUtil';

export const config: Scopes = {
  public: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId'] } },
  },

  internal: {
    roles: ['ADMIN', 'OWNER'],
  },

  private: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId'] } },
    self: true,
  },
};

export const UserSanctionScopes = new ScopeUtil(config);
