import type { FindOptions } from 'sequelize';
import type { BaseScope } from '../../middlewares/auth';

export const LogScopes: { [key in BaseScope]: FindOptions } = {
  public: {
    attributes: { exclude: ['stack', 'headers'] },
  },

  internal: {
    attributes: { exclude: ['stack', 'headers'] },
  },

  private: {

  },

  system: {

  },
};

export type LogScope = keyof typeof LogScopes;

export const LogDefaultScopeName = 'public';
export default LogScopes[LogDefaultScopeName];
