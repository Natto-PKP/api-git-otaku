import {
  Table,
  Column,
  DataType,
  BelongsTo,
  Scopes,
  DefaultScope,
  ForeignKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';

import { BaseModel, IBaseModel, UserModel, UserSanctionModel } from '../../..';
import { UserSanctionCommentScopes } from './UserSanctionCommentScopes';

export interface IUserSanctionCommentModel extends IBaseModel {
  sanctionId: string;
  senderId: string;
  content: string;
  edited: boolean;
}

@Scopes(() => UserSanctionCommentScopes.scopes())
@DefaultScope(() => UserSanctionCommentScopes.default())
@Table({ tableName: 'user_sanction_comment' })
export class UserSanctionCommentModel extends BaseModel implements IUserSanctionCommentModel {
  @AllowNull(false)
  @ForeignKey(() => UserSanctionModel)
  @Column({ type: DataType.STRING })
  declare sanctionId: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare senderId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare content: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare edited: boolean;

  @BelongsTo(() => UserSanctionModel, { onDelete: 'CASCADE' })
  declare sanction: UserSanctionModel;

  @BelongsTo(() => UserModel, { onDelete: 'SET NULL' })
  declare sender: UserModel;
}
