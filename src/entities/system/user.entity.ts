import { Entity, Column, BeforeInsert, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@src/common/base/base.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { MinLength } from 'class-validator';
import { UserRoleEntity } from '../relationalEntities/userRole.entity';
import { DeptEntity } from './department.entity';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
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

  @ApiProperty({ description: '用户登录账号' })
  @Column({ length: 32, comment: '用户登录账号' })
  public username: string;

  @ApiProperty({ description: '显示昵称' })
  @Column({ nullable: true, length: 32, comment: '用户显示昵称' })
  public nickname: string;

  @Column({ name: 'is_disabled', default: true, comment: '所属状态是否有效， 使用中， 禁用' })
  public isDisabled: boolean;

  @Column({ name: 'login_count', default: 0, comment: '登录次数' })
  public loginCount: number;

  @Column({ nullable: true, comment: '手机号', length: 20 })
  public mobile: string;

  @Column({ nullable: true, comment: '邮箱', length: 64 })
  public email: string;

  @Column({ type: 'timestamp', name: 'last_login_time', comment: '最后一次登录时间' })
  public lastLoginTime: Date;

  @Column({ type: 'timestamp', name: 'login_time', comment: '登录时间' })
  public loginTime: Date;

  // 角色关系
  @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.users, {
    cascade: ['insert', 'remove'],
    nullable: false,
  })
  public userRoles: UserRoleEntity[];

  @ManyToOne(() => DeptEntity, (dept) => dept.deptUsers)
  public dept: DeptEntity;

  @BeforeInsert()
  private async encryptPwd() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
