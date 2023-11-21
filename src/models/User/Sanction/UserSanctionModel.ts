import {
  Table,
  Column,
  DataType,
  Unique,
  AllowNull,
  Default,
  BelongsTo,
  Scopes,
  DefaultScope,
  ForeignKey,
} from 'sequelize-typescript';

import { BaseModel, IBaseModel, UserModel } from '../..';
import { UserSanctionType, UserSanctionTypes } from './UserSanctionUtils';
import defaultScope, { UserSanctionScopes } from './UserSanctionScopes';

export interface IUserSanctionModel extends IBaseModel {
  userId: string; // sanctioned user
  reason: string; // reason of the sanction
  type: UserSanctionType; // type of the sanction
  endDate?: Date | null; // null if permanent
  byUserId?: string | null; // user who sanctioned

  askCancellation: boolean; // if the user asked for the cancellation
  askCancellationAt?: Date | null; // date of the cancellation request
  cancellationReason?: string | null; // reason of the cancellation
  cantCancel: boolean; // if the sanction can't be cancelled

  isCancelled: boolean; // if the sanction is cancelled
  cancelledAt?: Date | null; // date of the cancellation
  cancelledByUserId?: string | null; // user who cancelled
  cancelledReason?: string | null; // reason of the cancellation
}

@Scopes(() => UserSanctionScopes)
@DefaultScope(() => defaultScope)
@Table({ tableName: 'user_sanction' })
export class UserSanctionModel extends BaseModel implements IUserSanctionModel {
  @Unique
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare userId: string;

  @Column({ type: DataType.STRING })
  declare reason: string;

  @Column({ type: DataType.ENUM(...UserSanctionTypes) })
  declare type: UserSanctionType;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  declare endDate: Date | null;

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare byUserId: string | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare askCancellation: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  declare cancellationReason: string | null;

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

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare cantCancel: boolean;

  @Default(null)
  @Column({ type: DataType.DATE })
  declare askCancellationAt: Date | null;

  @BelongsTo(() => UserModel, 'userId')
  declare user: UserSanctionModel;

  @BelongsTo(() => UserModel, 'byUserId')
  declare byUser: UserModel;

  @BelongsTo(() => UserModel, 'cancelledByUserId')
  declare cancelledByUser: UserModel;
}
