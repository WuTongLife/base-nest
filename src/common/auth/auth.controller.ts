import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '@common/decorators';
import { RegisterUserDto, LoginUserDto } from './dto';

@ApiBearerAuth()
@ApiTags('用户登录')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @Public()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 200, description: '注册成功' })
  @Public()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
