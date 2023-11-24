import { Table, Column, DataType, AllowNull, Scopes, DefaultScope } from 'sequelize-typescript';

import { BaseModel, IBaseModel } from '../..';
import type { ErrorCode, ErrorType } from '../../../errors/BaseError';
import { ApiLogScopes } from './ApiLogScopes';
import type { ObjectType } from './ApiLogUtils';

export interface IApiLogModel extends IBaseModel {
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

@Scopes(() => ApiLogScopes.scopes())
@DefaultScope(() => ApiLogScopes.default())
@Table({ tableName: 'api_log' })
export class ApiLogModel extends BaseModel implements IApiLogModel {
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare type: ErrorType;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare status: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare code: ErrorCode;

  @AllowNull(false)
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
