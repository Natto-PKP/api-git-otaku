import type { FindOptions } from 'sequelize';
import type { BaseScope } from '../../middlewares/auth';

export const UserScopes: { [key in BaseScope]: FindOptions } = {
  public: {
    attributes: { exclude: ['password', 'email', 'isVerified', 'blockedUntil', 'isBlocked', 'isBanned', 'createdById', 'updatedById', 'updatedAt'] },
    where: { isBanned: false, isBlocked: false, isPrivate: false },
  },

  internal: {
    attributes: { exclude: ['password', 'createdById', 'updatedById'] },
  },

  private: {
    attributes: { exclude: ['password', 'createdById', 'updatedById'] },
  },

  system: {

  },
};

export type UserScope = keyof typeof UserScopes;

export const UserDefaultScopeName = 'public';
export default UserScopes[UserDefaultScopeName];
