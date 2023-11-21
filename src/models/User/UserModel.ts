import { Table, Column, DataType, Unique, AllowNull, Default, Scopes, DefaultScope } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { BaseModel, IBaseModel, UserSanctionModel } from '..';
import { PseudoRegex, UsernameRegex, UserRoles, type UserRole, USER_ROLE_HIERARCHY } from './UserUtils';
import defaultScope, { UserScopes } from './UserScopes';
import { Op } from 'sequelize';

export interface IUserModel extends IBaseModel {
  username: string; // unique
  email: string; // unique
  password: string;
  pseudo: string; // unique
  role: UserRole;
  isPrivate: boolean; // default false

  avatarId?: string | null; // default null

  isVerified: boolean; // default false
  verifiedAt?: Date | null; // default null
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
  declare isPrivate: boolean;

  // methods
  isRoleHigher(than: UserRole) {
    const role = this.getDataValue('role') as UserRole;
    return USER_ROLE_HIERARCHY[role] > USER_ROLE_HIERARCHY[than];
  }

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

  async isBanned() {
    const count = await UserSanctionModel.count({
      where: { userId: this.id, isFinished: false, type: { [Op.in]: ['TEMP_BAN', 'BAN'] } },
    });

    return count > 0;
  }

  async isWarned() {
    const count = await UserSanctionModel.count({
      where: { userId: this.id, isFinished: false, type: { [Op.in]: ['WARN'] } },
    });

    return count > 0;
  }
}
