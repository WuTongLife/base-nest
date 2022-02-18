import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { UserEntity } from '@entities';
import { UpdateUserDto } from './dto/update-user.dto';

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

  /**
   * 修改用户
   * @param user 提交的值
   * @param updateKeys 修改的字段
   * @returns
   */
  async updateUser(user: UpdateUserDto, updateKeys: (keyof UserEntity)[]) {
    return await this.updateAsync(user, updateKeys);
  }
}
