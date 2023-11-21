import { v4 as uuid } from 'uuid';
import { Model, Column, Default, PrimaryKey, DataType, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { UserModel } from '.';

// Types
export interface IBaseModel {
  id: string;
  updatedById?: string | null;
  createdById?: string | null;
}

/**
 * Base model
 */
export class BaseModel extends Model implements IBaseModel {
  @PrimaryKey
  @Default(() => uuid())
  @Column({ type: DataType.TEXT })
  declare id: string;

  @AllowNull(true)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare updatedById: string;

  @BelongsTo(() => UserModel, { foreignKey: 'updatedById', onDelete: 'SET NULL' })
  declare updatedBy: UserModel;

  @AllowNull(true)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare createdById: string;

  @BelongsTo(() => UserModel, { foreignKey: 'createdById', onDelete: 'SET NULL' })
  declare createdBy: UserModel;
}
