import type { FindOptions } from 'sequelize';
import type { BaseScope } from '../../../middlewares/auth';

export const UserSanctionScopes: { [key in BaseScope]: FindOptions } = {
  public: {
    attributes: { exclude: ['byUserId', 'cancelledByUserId'] },
  },

  internal: {},

  private: {
    attributes: { exclude: ['byUserId', 'cancelledByUserId'] },
  },

  system: {},
};

export type UserSanctionScope = keyof typeof UserSanctionScopes;

export default UserSanctionScopes.public;
