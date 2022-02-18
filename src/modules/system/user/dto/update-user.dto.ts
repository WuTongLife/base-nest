import { UserEntity } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/graphql';

export class UpdateUserDto extends PartialType(UserEntity) {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  public id: number;
}
