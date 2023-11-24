import {
  Table,
  Column,
  DataType,
  AllowNull,
  Default,
  BelongsTo,
  Scopes,
  DefaultScope,
  ForeignKey,
} from 'sequelize-typescript';

import { BaseModel, IBaseModel, UserModel } from '../..';
import { UserSanctionType, UserSanctionTypes } from './UserSanctionUtils';
import { UserSanctionScopes } from './UserSanctionScopes';

export interface IUserSanctionModel extends IBaseModel {
  userId: string; // sanctioned user
  reason: string; // reason of the sanction
  type: UserSanctionType; // type of the sanction
  expireAt?: Date | null; // null if permanent
  byUserId?: string | null; // user who sanctioned

  askCancellation: boolean; // if the user asked for the cancellation
  askCancellationAt?: Date | null; // date of the cancellation request
  cancellationReason?: string | null; // reason of the cancellation

  isCancelled: boolean; // if the sanction is cancelled
  cancelledAt?: Date | null; // date of the cancellation
  cancelledByUserId?: string | null; // user who cancelled
  cancelledReason?: string | null; // reason of the cancellation
}

@Scopes(() => UserSanctionScopes.scopes())
@DefaultScope(() => UserSanctionScopes.default())
@Table({ tableName: 'user_sanction' })
export class UserSanctionModel extends BaseModel implements IUserSanctionModel {
  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare userId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare reason: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...UserSanctionTypes) })
  declare type: UserSanctionType;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare expireAt: Date | null;

  @Column({ type: DataType.VIRTUAL })
  get isExpired() {
    return this.expireAt !== null && this.expireAt.getTime() < Date.now();
  }

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare byUserId: string | null;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare askCancellation: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  declare cancellationReason: string | null;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    set(this: UserSanctionModel, value: boolean) {
      if (value === true) this.setDataValue('cancelledAt', new Date());
      else this.setDataValue('cancelledAt', null);

      this.setDataValue('isCancelled', value);
    },
  })
  declare isCancelled: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare cancelledAt: Date | null;

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare cancelledByUserId: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  declare cancelledReason: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare askCancellationAt: Date | null;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    set(this: UserSanctionModel, value: boolean) {
      if (value === true) this.setDataValue('finishedAt', new Date());
      else this.setDataValue('finishedAt', null);

      this.setDataValue('isFinished', value);
    },
  })
  declare isFinished: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare finishedAt: Date | null;

  @BelongsTo(() => UserModel, { onDelete: 'CASCADE' })
  declare user: UserModel;

  @BelongsTo(() => UserModel, { onDelete: 'SET NULL' })
  declare byUser: UserModel;

  @BelongsTo(() => UserModel, { onDelete: 'SET NULL' })
  declare cancelledByUser: UserModel;
}
