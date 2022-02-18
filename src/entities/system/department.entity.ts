import { BaseEntity } from '@common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { DeptPermEntity } from '../relationalEntities';
import { UserEntity } from './user.entity';

@Entity('sys_dept')
export class DeptEntity extends BaseEntity {
  @ApiProperty({ description: '名称' })
  @Column({ type: 'varchar', name: 'dept_name', length: 40, comment: '名称' })
  public deptName: string;

  @ApiProperty({ description: '父级ID' })
  @Column({ name: 'parend_id', default: 0, comment: '父级ID' })
  public parendId: number;

  @ApiProperty({ description: '显示顺序' })
  @Column({ name: 'order_num', default: 0, comment: '显示顺序' })
  public orderNum: number;

  @ApiProperty({ description: '描述' })
  @Column({ name: 'varchar', length: 200, nullable: true, comment: '描述' })
  public description: string;

  // @OneToMany(() => DeptPermEntity, (deptPerms) => deptPerms.depts, {
  //   cascade: true,
  // })
  // public deptPerms: DeptPermEntity[];

  @OneToMany(() => UserEntity, (user) => user.dept)
  deptUsers: UserEntity[];
}
