import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@entities';

export class LoginResultDto {
  @ApiProperty({ description: 'Token' })
  readonly token: string;

  @ApiProperty({ description: '登录用户' })
  readonly userInfo: UserEntity;

  @ApiProperty({ description: '过期时间' })
  readonly expiresIn: number;
}
