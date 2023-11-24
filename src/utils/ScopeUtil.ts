import type { ScopesOptions } from 'sequelize-typescript';
import Joi from 'joi';
import { UserPermission, UserPermissionManager, UserRole, UserRoles } from '../models/User/UserUtils';
import { FindOptions } from 'sequelize';

export const Scopes = ['public', 'internal', 'private', 'system'];
export type Scope = 'public' | 'internal' | 'private' | 'system';

export const ScopeSchemaData = {
  scope: Joi.string().valid('public', 'internal', 'private').default('public'),
};

interface ScopeOptions {
  options?: ScopesOptions;
  self?: boolean | null;
  permissions?: UserPermission[] | bigint;
  roles?: UserRole[];
}

export type Scopes = {
  public?: ScopeOptions;
  internal?: ScopeOptions;
  private?: ScopeOptions;
  system?: ScopeOptions;
} & { [key: string]: ScopeOptions | undefined };

interface VerifyOptions {
  self?: boolean | null;
  role?: UserRole;
}

export class ScopeUtil {
  constructor(public config: Scopes = {}) {}

  getScope(scope: Scope) {
    return this.config[scope];
  }

  default() {
    return (this.config.public?.options || {}) as FindOptions;
  }

  scopes() {
    const result = {} as Record<string, ScopesOptions>;

    for (const scope of Scopes) {
      const s = this.config[scope];
      if (s && s.options) result[scope] = s.options;
    }

    return {
      public: {},
      internal: {},
      private: {},
      system: {},
      ...result,
    };
  }

  verify(scope: Scope = 'public', options?: VerifyOptions) {
    if (!Scopes.includes(scope) || scope === 'system') return false;
    if (scope === 'public') return true;

    const s = this.config[scope];
    if (!s) return true; // If scope is not defined, it is public

    if (options?.self && s?.self) return true;

    if (s.roles) {
      const role = options?.role || 'USER';
      if (s.roles.includes(role)) return true;
    }

    if (s.permissions) {
      const permissions = UserRoles[options?.role || 'USER'];
      if (permissions && UserPermissionManager.has(permissions, s.permissions)) return true;
    }

    return false;
  }
}
