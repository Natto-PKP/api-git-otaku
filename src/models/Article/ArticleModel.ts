import {
  Table,
  Column,
  DataType,
  Unique,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';

import { BaseModel, IBaseModel } from '../BaseModel';
import { IdentifierService } from '../../utils/IdentifierUtil';
import {
  ArticleTypes,
  type ArticleStatus,
  type ArticleVisibility,
  type ArticleType,
  ArticleVisibilities,
  ArticleStatuses,
} from './ArticleUtils';
import { ArticleScopes } from './ArticleScopes';

export interface IArticleModel extends IBaseModel {
  identifier: string;
  title: string;
  aliases: string[];
  description?: string | null;
  synopsis?: string | null;
  content?: string | null;

  volumes?: number | null; // can be set if type is MANGA or NOVEL or WEBTOON
  chapters?: number | null; // can be set if type is MANGA or NOVEL or WEBTOON
  episodes?: number | null; // can be set if type is ANIME or SERIE
  seasons?: number | null; // can be set if type is ANIME or SERIE
  duration?: number | null; // represent in minutes the duration to watch or read

  type: ArticleType;

  status: ArticleStatus;
  canceledAt?: Date | null; // can be set if status is CANCELED
  beginAt?: Date | null; // can be set if status is ONGOING
  endAt?: Date | null; // can be set if status is FINISHED

  visibility: ArticleVisibility;
  publishedAt?: Date | null; // automatically set when visibility is PUBLISHED
  deletedAt?: Date | null; // automatically set when visibility is DELETED
  fromArticleId?: string | null; // can be set if visibility is SUGGESTED and when it's an update

  // tags: string[];
  // categories: string[];
  // staff: string[];
  // characters: string[];
  // images: string[];
  // banner: string;
  // trailer: string;
  // thumbnail: string;
  // author: string;
  // artist: string;
  // publisher: string;
  // studio: string;
  // franchise: string;
  // series: string;
  // copyright?: string | null;
  // contributors: string[];
}

@Scopes(() => ArticleScopes.scopes())
@DefaultScope(() => ArticleScopes.default())
@Table({ tableName: 'article' })
export class ArticleModel extends BaseModel {
  @Unique
  @Default(() => IdentifierService.generate({ characters: ['lower', 'upper', 'number'], length: 7 }))
  @Column({ type: DataType.STRING })
  declare identifier: string;

  @Column({ type: DataType.STRING })
  declare title: string;

  @Default('UNKNOWN')
  @Column({ type: DataType.ENUM(...ArticleTypes) })
  declare type: ArticleType;

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  declare aliases?: string[] | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare description?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare synopsis?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare content?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare beginAt?: Date | null;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare endAt?: Date | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare volumes?: number | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare chapters?: number | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare episodes?: number | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare seasons?: number | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare duration?: number | null;

  @Default('DRAFT')
  @Column({
    type: DataType.ENUM(...ArticleVisibilities),
    set(this: ArticleModel, value: ArticleVisibility) {
      if (value === 'PUBLISHED') this.setDataValue('publishedAt', new Date()); // set publishedAt
      else this.setDataValue('publishedAt', null); // reset publishedAt

      if (value === 'DELETED') this.setDataValue('deletedAt', new Date()); // set deletedAt
      else this.setDataValue('deletedAt', null); // reset deletedAt

      if (value === 'SUGGESTED') this.setDataValue('suggestAt', new Date()); // set suggestAt

      this.setDataValue('visibility', value); // set visibility
    },
  })
  declare visibility: ArticleVisibility;

  @Default('UNKNOWN')
  @Column({ type: DataType.ENUM(...ArticleStatuses) })
  declare status: ArticleStatus;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare publishedAt?: Date | null;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare deletedAt?: Date | null;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  declare canceledAt?: Date | null;

  @AllowNull(true)
  @ForeignKey(() => ArticleModel)
  @Column({ type: DataType.UUID })
  declare fromArticleId?: string | null;

  @BelongsTo(() => ArticleModel, { foreignKey: 'fromArticleId', onDelete: 'CASCADE' })
  declare fromArticle: ArticleModel | null;
}
