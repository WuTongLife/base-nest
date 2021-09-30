import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@src/common/base/base.entity';
import { Exclude } from 'class-transformer';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: true,
    length: 200,
    comment: '用户登录密码',
    type: 'varchar',
  })
  @Exclude()
  public password: string;

  @Column({ length: 32, comment: '用户登录账号' })
  public username: string;

  @Column({ nullable: true, length: 32, comment: '用户显示昵称' })
  public nickname: string;

  @Column({ default: true, comment: '所属状态是否有效， 使用中， 禁用' })
  public status: boolean;
}
