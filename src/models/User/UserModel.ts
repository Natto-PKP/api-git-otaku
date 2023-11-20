import {
  Table,
  Column,
  DataType,
  Unique,
  AllowNull,
  Default,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { BaseModel, IBaseModel } from '..';
import {
  PseudoRegex, UsernameRegex, UserRoles, type UserRole, USER_ROLE_HIERARCHY,
} from './UserUtils';
import defaultScope, { UserScopes } from './UserScopes';

export interface IUserModel extends IBaseModel {
  username: string;
  email: string;
  password: string;
  pseudo: string;
  avatarId?: string | null;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  blockedUntil?: Date | null;
  isBanned: boolean;
  isPrivate: boolean;
}

@Scopes(() => UserScopes)
@DefaultScope(() => defaultScope)
@Table({ tableName: 'user' })
export class UserModel extends BaseModel implements IUserModel {
  @Unique
  @Column({ type: DataType.STRING, validate: { is: UsernameRegex } })
  declare username: string;

  @Unique
  @Column({ type: DataType.STRING, validate: { isEmail: true } })
  declare email: string;

  @Column({
    type: DataType.STRING,
    set(this: UserModel, value: string) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    },
  })
  declare password: string;

  @Unique
  @Column({ type: DataType.STRING, validate: { is: PseudoRegex } })
  declare pseudo: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  declare avatarId: string | null;

  @Default('USER')
  @Column({ type: DataType.ENUM(...UserRoles) })
  declare role: UserRole;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isVerified: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isBlocked: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare blockedUntil: Date | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isBanned: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isPrivate: boolean;

  // methods
  /**
   * Check if user role is higher than the given role
   * @param than
   * @returns
   */
  isRoleHigher(than: UserRole) {
    const role = this.getDataValue('role') as UserRole;
    return USER_ROLE_HIERARCHY[role] > USER_ROLE_HIERARCHY[than];
  }

  /**
   * Check if user role is higher or equal to the given role
   * @param than
   * @returns
   */
  isRoleHigherOrEqual(than: UserRole) {
    const role = this.getDataValue('role') as UserRole;
    return USER_ROLE_HIERARCHY[role] >= USER_ROLE_HIERARCHY[than];
  }

  isAdminOrHigher() {
    return this.isRoleHigherOrEqual('ADMIN');
  }

  isHelperOrHigher() {
    return this.isRoleHigherOrEqual('HELPER');
  }

  isOwner() {
    return this.role === 'OWNER';
  }
}
