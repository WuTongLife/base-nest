import { UserEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResultDto, LoginUserDto, RegisterUserDto } from './dto';
import { HttpForbiddenError, ValidationError } from '@common/exceptions';
import { CacheService } from '@cache';
import { ConfigService } from '@nestjs/config';
import { IHttpResponseBase } from '@interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: CacheService,
    private readonly config: ConfigService,
  ) {}

  // 验证用户
  async validateUser(username: string, password: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.findOneByAccount(username);
    if (!user) {
      throw new ValidationError('账号错误');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ValidationError('账号或密码错误');
    }
    const { password: ignorePass, ...restUser } = user;
    return restUser;
  }

  async login(user: UserEntity): Promise<LoginResultDto> {
    if (!user.status) throw new HttpForbiddenError('该账号已被禁用，请切换账号登录');
    // 生成 token
    const token = await this.createToken({
      id: user.id,
      username: user.username,
      password: user.password,
    });
    // 过期时间
    let expiresIn = this.config.get('JWT.expiresIn');
    if (typeof expiresIn === 'string' && expiresIn.includes('h')) {
      expiresIn = Number(expiresIn.replace('h', '')) * 60 * 60;
    }
    await this.redisService.set(`user-token-${user.id}`, token, expiresIn); // 在这里使用redis
    // 返回生成的 token
    return { token, userInfo: user, expiresIn };
  }

  async registerUser(dto: RegisterUserDto): Promise<IHttpResponseBase> {
    // 检查用户名是否存在
    const existing = await this.findOneByAccount(dto.username);
    if (existing) throw new ValidationError('账号已存在');
    // 判断密码是否相等
    if (dto.password !== dto.confirmPassword) throw new ValidationError('两次输入密码不一致，请重试');
    // 通过验证， 插入数据
    const findOneByname = new UserEntity();
    Object.assign(findOneByname, dto);
    await this.userRepository.save(findOneByname);
    return { code: 200, msg: '注册成功' };
  }

  // 根据用户名查询用户信息
  async findOneByAccount(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }

  private async createToken(payload: { id: number; username: string; password: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
