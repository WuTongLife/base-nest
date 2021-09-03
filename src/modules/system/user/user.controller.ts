import { Controller, Post, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('allList')
  @ApiOperation({ summary: '用户列表' })
  @UseInterceptors(ClassSerializerInterceptor)
  allUser() {
    return this.userService.allUser();
  }
}
