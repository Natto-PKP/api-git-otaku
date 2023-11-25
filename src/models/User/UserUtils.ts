import { FlagManager } from '../../managers/FlagManager';

export const UsernameRegex = /^[a-z](?:[a-z]*_?[a-z]+){3,32}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
export const PseudoRegex = /^[A-Za-z0-9](?:[A-Za-z0-9]*[-_ :]?[A-Za-z0-9]+){3,32}$/;

export const UserPermissions = {
  'user.manage': 1n << 0n,
  'user.manage.role': 1n << 1n,
  'user.manage.verified': 1n << 13n,

  'user.sanction': 1n << 2n,
  'user.sanction.create': 1n << 14n,
  'user.sanction.remove': 1n << 15n,
  'user.sanction.manage': 1n << 16n,

  'article.suggest': 1n << 3n,
  'article.create': 1n << 4n,
  'article.manage': 1n << 5n,
  'article.remove': 1n << 6n,

  'reaction.add': 1n << 7n,

  'comment.create': 1n << 8n,
  'comment.manage': 1n << 9n,

  'list.create': 1n << 10n,
  'list.manage': 1n << 11n,
  'list.remove': 1n << 12n,

  'api.log': 1n << 17n,
  'api.log.manage': 1n << 18n,

  log: 1n << 19n,
  'log.manage': 1n << 20n,
};

export type UserPermission = keyof typeof UserPermissions;
export const UserPermissionList = Object.keys(UserPermissions) as UserPermission[];

export const UserPermissionManager = new FlagManager(UserPermissions);

export const UserRoles = {
  USER: UserPermissionManager.merge(['article.suggest', 'reaction.add', 'comment.create', 'list.create']),

  HELPER: UserPermissionManager.merge([
    'article.suggest',
    'reaction.add',
    'comment.create',
    'list.create',
    'article.create',
    'article.manage',
  ]),

  MODERATOR: UserPermissionManager.merge([
    'article.suggest',
    'reaction.add',
    'comment.create',
    'list.create',
    'comment.manage',
    'list.manage',
    'user.sanction',
    'user.sanction.create',
  ]),

  ADMIN: UserPermissionManager.merge([
    'article.suggest',
    'reaction.add',
    'comment.create',
    'list.create',
    'list.manage',
    'list.remove',
    'article.create',
    'article.manage',
    'article.remove',
    'comment.manage',
    'user.manage',
    'user.manage.role',
    'user.sanction',
    'user.sanction.create',
    'user.sanction.remove',
    'user.sanction.manage',
  ]),

  SUPER_ADMIN: UserPermissionManager.merge(Object.keys(UserPermissions) as UserPermission[]),
};

export type UserRole = keyof typeof UserRoles;

export const UserRoleList = ['USER', 'HELPER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] as UserRole[];
