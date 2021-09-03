import { UserEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from './dto';
import { HttpForbiddenError, ValidationError } from '@common/exceptions';
import { CryptoUtil } from '@utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  // 验证用户
  async validateUser(payload: { id: number; username: string; password: string }): Promise<any> {
    const user = await this.findOneByAccount(payload.username);
    if (user && user.password === payload.password && user.username === payload.username) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginUserDto): Promise<{ token: string }> {
    // 查询用户
    const user = await this.findOneByAccount(dto.username);
    if (!user) throw new ValidationError('账号错误');
    // 判断密码是否相等
    if (!this.cryptoUtil.checkPassword(dto.password, user.password)) throw new ValidationError('账号或密码错误');
    // 是否被禁用
    if (!user.status) throw new HttpForbiddenError('该账号已被禁用，请切换账号登录');
    // 生成 token
    const token = await this.createToken({
      id: user.id,
      username: user.username,
      password: user.password,
    });
    // 返回生成的 token
    return { token };
  }

  async registerUser(dto: RegisterUserDto): Promise<UserEntity> {
    // 检查用户名是否存在
    const existing = await this.findOneByAccount(dto.username);
    if (existing) throw new ValidationError('账号已存在');
    // 判断密码是否相等
    if (dto.password !== dto.confirmPassword) throw new ValidationError('两次输入密码不一致，请重试');
    // 密码加密
    dto.password = this.cryptoUtil.encryptPassword(dto.password);
    // 通过验证， 插入数据
    const findOneByname = new UserEntity();
    Object.assign(findOneByname, dto);
    const result = await this.userRepository.save(findOneByname);
    return result;
  }

  // 根据用户名查询用户信息
  async findOneByAccount(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }

  private async createToken(payload: { id: number; username: string; password: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
