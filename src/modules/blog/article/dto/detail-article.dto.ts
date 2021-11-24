import { EnumArticleEditorType, EnumArticleStatus } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class DetailArticleDto {
  @ApiProperty({ description: '文章标题' })
  readonly title: string;

  @Exclude()
  readonly userId: number;
  @Exclude()
  readonly update_date: string;

  @ApiProperty({ description: '标签名' })
  readonly tagNames: string;

  @ApiProperty({ description: '标签id' })
  readonly tags: string;

  @ApiProperty({ description: '封面' })
  readonly coverImg: string;

  @ApiProperty({ description: '文章内容' })
  readonly content: string;

  @ApiProperty({ description: '状态名' })
  @Transform(({ value }) => EnumArticleStatus[value], { toClassOnly: true })
  @Expose({ name: 'status' })
  readonly statusName: string;

  @ApiProperty({ description: '文章编辑器类型' })
  @Transform(({ value }) => EnumArticleEditorType[value], { toClassOnly: true })
  @Expose({ name: 'editorType' })
  readonly editorTypeName: string;

  @ApiProperty({ description: '创建名称' })
  readonly creatorName: string;

  @ApiProperty({ description: '创建日期' })
  @Transform(({ value }) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'), { toClassOnly: true })
  @Expose({ name: 'create_date' })
  readonly createDate: string;

  @ApiProperty({ description: '发布日期' })
  @Transform(({ value }) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'), { toClassOnly: true })
  readonly publishTime: string;
}
