import { Table, Column, DataType, AllowNull, Scopes, DefaultScope } from 'sequelize-typescript';

import { BaseModel, IBaseModel } from '..';
import type { ErrorCode, ErrorType } from '../../errors/BaseError';
import { LogScopes } from './LogScopes';
import type { ObjectType } from './LogUtils';

export interface ILogModel extends IBaseModel {
  type: ErrorType;
  status: number;
  code: ErrorCode;
  message: string;
  stack?: string | null;
  url?: string | null;
  method?: string | null;
  params?: ObjectType | null;
  query?: ObjectType | null;
  body?: ObjectType | null;
  headers?: ObjectType | null;
}

@Scopes(() => LogScopes.scopes())
@DefaultScope(() => LogScopes.default())
@Table({ tableName: 'log' })
export class LogModel extends BaseModel implements ILogModel {
  @Column({ type: DataType.STRING })
  declare type: ErrorType;

  @Column({ type: DataType.INTEGER })
  declare status: number;

  @Column({ type: DataType.STRING })
  declare code: ErrorCode;

  @Column({ type: DataType.STRING })
  declare message: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare stack: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare url: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare method: string | null;

  @AllowNull(true)
  @Column({ type: DataType.JSON })
  declare params: ObjectType | null;

  @AllowNull(true)
  @Column({ type: DataType.JSON })
  declare query: ObjectType | null;

  @AllowNull(true)
  @Column({ type: DataType.JSON })
  declare body: ObjectType | null;

  @AllowNull(true)
  @Column({ type: DataType.JSON })
  declare headers: ObjectType | null;
}
