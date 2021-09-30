import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { UserEntity } from '@entities';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async allUser(): Promise<[UserEntity[], number]> {
    return this.userRepository.findAndCount();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id, {
      relations: [],
    });
    if (!user) throw new HttpException('该用户不存在或已删除', HttpStatus.BAD_REQUEST);
    return user;
  }

  // 根据用户id查询用户信息, 只查用户表，
  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  // 根据用户名查询用户信息
  async findOneByAccount(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }
}
