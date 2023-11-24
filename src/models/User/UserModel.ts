import { Table, Column, DataType, Unique, AllowNull, Default, Scopes, DefaultScope } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { BaseModel, IBaseModel } from '..';
import {
  PseudoRegex,
  UserPermission,
  UserPermissionManager,
  UserRole,
  UserRoleList,
  UserRoles,
  UsernameRegex,
} from './UserUtils';
import { UserScopes } from './UserScopes';

export interface IUserModel extends IBaseModel {
  username: string; // unique
  email: string; // unique
  password: string;
  pseudo: string;

  role: UserRole; // default 'USER'

  // avatarId?: string | null; // default null
  // bannerId?: string | null; // default null

  isPrivate: boolean; // default false

  isVerified: boolean; // default false
  verifiedAt?: Date | null; // default null
}

@Scopes(() => UserScopes.scopes())
@DefaultScope(() => UserScopes.default())
@Table({ tableName: 'user' })
export class UserModel extends BaseModel implements IUserModel {
  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, validate: { is: UsernameRegex } })
  declare username: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, validate: { isEmail: true } })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    set(this: UserModel, value: string) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    },
  })
  declare password: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, validate: { is: PseudoRegex } })
  declare pseudo: string;

  @AllowNull(false)
  @Default('USER')
  @Column({ type: DataType.ENUM(...UserRoleList) })
  declare role: UserRole;

  @Column({ type: DataType.VIRTUAL })
  get permissions() {
    return UserPermissionManager.resolve(UserRoles[this.role]);
  }

  // @AllowNull(true)
  // @Default(null)
  // @Column({ type: DataType.STRING })
  // declare avatarId: string | null;

  // @AllowNull(true)
  // @Default(null)
  // @Column({ type: DataType.STRING })
  // declare bannerId: string | null;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isPrivate: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isVerified: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare verifiedAt: Date | null;

  // methods
  hasPermissions(permissions: UserPermission | UserPermission[]) {
    const current = UserRoles[this.role];
    return UserPermissionManager.has(current, permissions);
  }

  isRoleHigherOrEqual(role: UserRole) {
    const currentPosition = UserRoleList.indexOf(this.role);
    const targetPosition = UserRoleList.indexOf(role);

    return currentPosition >= targetPosition;
  }

  isRoleLowerOrEqual(role: UserRole) {
    const currentPosition = UserRoleList.indexOf(this.role);
    const targetPosition = UserRoleList.indexOf(role);

    return currentPosition <= targetPosition;
  }
}
