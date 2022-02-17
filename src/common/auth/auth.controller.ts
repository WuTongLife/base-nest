import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipJwtAuth } from '@common/decorators';
import { LoginResultDto, LoginUserDto, RegisterUserDto } from './dto';
import { LocalAuthGuard } from '@common/guards';

@ApiBearerAuth()
@ApiTags('用户登录')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, description: '登录成功', type: LoginResultDto })
  @UseGuards(LocalAuthGuard)
  @SkipJwtAuth()
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 200, description: '注册成功' })
  @SkipJwtAuth()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
