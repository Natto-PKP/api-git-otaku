import { ScopeUtil, Scopes } from '../../../utils/ScopeUtil';

export const config: Scopes = {
  public: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId', 'cancelledReason'] } },
  },

  private: {
    options: { attributes: { exclude: ['byUserId', 'cancelledByUserId', 'cancelledReason'] } },
    self: true,
  },
};

export const UserSanctionScopes = new ScopeUtil(config);
