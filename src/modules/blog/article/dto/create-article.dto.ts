import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumArticleEditorType, EnumArticleStatus } from '@common/enums';

export class CreateArticleDto {
  @ApiProperty()
  @IsString({ message: '文章标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;

  @ApiProperty()
  @IsString({ message: '文章图片' })
  readonly coverImg: string;

  @ApiProperty()
  @IsString({ message: '文章内容' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  readonly content: string;

  @ApiProperty()
  @IsEnum(EnumArticleStatus, { message: '文章状态错误' })
  readonly status: EnumArticleStatus;

  @ApiProperty()
  @IsEnum(EnumArticleEditorType, { message: '文章内容类型' })
  readonly editorType: EnumArticleEditorType;
}
