import type { FindOptions } from 'sequelize';
import type { BaseScope } from '../../middlewares/auth';

export const UserScopes: { [key in BaseScope]: FindOptions } = {
  public: {
    attributes: {
      exclude: ['password', 'email', 'isVerified', 'createdById', 'updatedById', 'updatedAt'],
    },
    where: { isPrivate: false },
  },

  internal: {
    attributes: { exclude: ['password', 'createdById', 'updatedById'] },
  },

  private: {
    attributes: { exclude: ['password', 'createdById', 'updatedById'] },
  },

  system: {},
};

export type UserScope = keyof typeof UserScopes;

export default UserScopes.public;
