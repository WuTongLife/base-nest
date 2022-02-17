import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from '@src/common/base/base.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { MinLength } from 'class-validator';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ description: '登录密码' })
  @Column({
    nullable: true,
    length: 200,
    comment: '用户登录密码',
    type: 'varchar',
  })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MinLength(20, { message: '密码长度不能超过20位' })
  @Exclude()
  public password: string;

  @ApiProperty({ description: '登录账号' })
  @Column({ length: 32, comment: '用户登录账号' })
  public username: string;

  @ApiProperty({ description: '显示昵称' })
  @Column({ nullable: true, length: 32, comment: '用户显示昵称' })
  public nickname: string;

  @Column({ default: true, comment: '所属状态是否有效， 使用中， 禁用' })
  public status: boolean;

  @BeforeInsert()
  private async encryptPwd() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
