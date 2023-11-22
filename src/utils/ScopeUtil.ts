import type { ScopesOptions } from 'sequelize-typescript';
import { UserRole } from '../models/User/UserUtils';
import Joi from 'joi';
import { FindOptions } from 'sequelize';

export const Scopes = ['public', 'internal', 'private', 'system'];
export type Scope = 'public' | 'internal' | 'private' | 'system';

export const ScopeSchemaData = {
  scope: Joi.string().valid('public', 'internal', 'private').default('public'),
};

interface ScopeOptions {
  options?: ScopesOptions;
  self?: boolean | null;
  roles?: UserRole[] | null;
}

export interface Scopes {
  public?: Omit<ScopeOptions, 'self' | 'roles'>;
  internal?: ScopeOptions;
  private?: ScopeOptions;
  system?: Omit<ScopeOptions, 'self' | 'roles'>;
}

interface VerifyOptions {
  role?: UserRole | null;
  self?: boolean | null;
}

export class ScopeUtil {
  constructor(public config: Scopes) {}

  getScope(scope: Scope) {
    return this.config[scope];
  }

  default() {
    return (this.config.public?.options || {}) as FindOptions;
  }

  scopes() {
    return {
      public: this.config.public?.options || {},
      internal: this.config.internal?.options || {},
      private: this.config.private?.options || {},
      system: this.config.system?.options || {},
    };
  }

  verify(scope: Scope = 'public', options?: VerifyOptions) {
    if (!Scopes.includes(scope) || scope === 'system') return false;
    if (scope === 'public') return true;

    const s = this.config[scope];
    if (!s) return true; // If scope is not defined, it is public
    if (options?.role && s?.roles && s.roles.includes(options.role)) return true;
    if (options?.self && s?.self) return true;
    return false;
  }
}
