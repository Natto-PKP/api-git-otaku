import { ScopeUtil, Scopes } from '../../../utils/ScopeUtil';

export const config: Scopes = {
  public: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId'] } },
  },

  private: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId'] } },
  },
};

export const UserSanctionScopes = new ScopeUtil(config);
