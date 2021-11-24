import { isNotEmpty, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'id不能为空' })
  readonly id: number;

  @ApiProperty()
  readonly tagList: number[];

  @ApiProperty()
  readonly coverImg: string;

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.editorType))
  @IsNotEmpty({ message: '文章内容不能为空' })
  readonly content: string;

  @ApiProperty()
  readonly title: string;
}
