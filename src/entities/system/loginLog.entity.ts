import { BaseEntity } from '@common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEntity, RoleMenuPermEntity } from '../relationalEntities';

@Entity('sys_login_log')
export class LoginLogEntity extends BaseEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ description: '用户ID' })
  @Column({ name: 'user_id', comment: '用户ID' })
  public userId: number;

  @ApiProperty({ description: '登录用户名' })
  @Column({ type: 'varchar', length: 32, comment: '登录用户名' })
  public username: string;

  @ApiProperty({ description: '登录IP' })
  @Column({ type: 'varchar', name: 'login_ip', length: 20, comment: '登录IP' })
  public ip: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_time',
    comment: '登录时间',
  })
  createDate: Date;

  @Column({
    type: 'timestamp',
    name: 'logout_time',
    comment: '登出时间',
  })
  logOutDate: Date;
}
