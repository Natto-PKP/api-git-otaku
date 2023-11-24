import { ScopeUtil, type Scopes } from '../../utils/ScopeUtil';

const config: Scopes = {
  public: {
    options: {
      attributes: { exclude: ['password', 'email', 'isVerified', 'createdById', 'updatedById', 'updatedAt'] },
      where: { isPrivate: false },
    },
  },

  internal: {
    options: { attributes: { exclude: ['password', 'email', 'isVerified'] } },
    permissions: ['user.manage'],
  },

  private: {
    options: { attributes: { exclude: ['password', 'createdById', 'updatedById'] } },
    self: true,
  },
};

export const UserScopes = new ScopeUtil(config);
