import { IsString, IsNotEmpty, IsEnum, ArrayMinSize, ValidateIf, isNotEmpty, Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumArticleEditorType, EnumArticleStatus } from '@common/enums';

export class CreateArticleDto {
  @ApiProperty()
  @Allow()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty({ message: '文章标签不可以为空' })
  @ArrayMinSize(1, { message: '文章标签至少有一个' })
  public tagList: number[];

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.coverImg))
  readonly coverImg: string;

  @ApiProperty()
  @IsNotEmpty({ message: '文章内容不能为空' })
  readonly content: string;

  @ApiProperty()
  @IsEnum(EnumArticleStatus, { message: '文章状态错误' })
  readonly status: EnumArticleStatus;

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.editorType))
  @IsEnum(EnumArticleEditorType, { message: '文章内容类型' })
  readonly editorType: EnumArticleEditorType;
}
