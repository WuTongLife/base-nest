import { IsNotEmpty, MaxLength, ValidateIf, IsInt, isNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDictionaryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'id不能为空' })
  readonly id: number;

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.parentId))
  @IsInt({
    message: '无效的id',
  })
  readonly parentId: number;

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.name))
  @MaxLength(100, { message: '字典名称最长100字符' })
  readonly name: string;

  @ApiProperty()
  @ValidateIf((obj) => isNotEmpty(obj.aliasKey))
  @MaxLength(100, { message: '关键字最长100字符' })
  readonly aliasKey: string;

  // @ApiProperty()
  // @IsString({ message: '字典描述字符串' })
  // @MaxLength(100, { message: '字典描述最长300字符' })
  // readonly description: string;
}
