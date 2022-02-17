import { Controller, Post, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@common/decorators';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('allList')
  @ApiOperation({ summary: '用户列表' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Permissions('sys_user:list')
  allUser() {
    return this.userService.allUser();
  }
}
