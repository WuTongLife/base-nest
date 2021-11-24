import { Allow, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDictionaryDto {
  @ApiProperty()
  @IsNotEmpty({ message: '字典名称不能为空' })
  @MaxLength(100, { message: '字典名称最长100字符' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '关键字不能为空' })
  @MaxLength(100, { message: '关键字最长100字符' })
  readonly aliasKey: string;

  // @ApiProperty()
  // @Allow()
  // @MaxLength(100, { message: '字典描述最长300字符' })
  // readonly description: string;
}
