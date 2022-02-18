import { BaseEntity } from '@common/base/base.entity';
import { EnumOperationPerm } from '@common/enums/permission';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { DeptPermEntity } from '../relationalEntities';

// @Entity('sys_data_perm')
export class DataPermissionEntity extends BaseEntity {
  @ApiProperty({ description: '对应权限表主键' })
  @Column({ name: 'perm_id', comment: '对应权限表主键' })
  public permId: number;

  @ApiProperty({ description: '是否可用' })
  @Column({ name: 'is_disabled', default: true, comment: '是否可用' })
  public isDisabled: boolean;

  @ApiProperty({ description: '参数' })
  @Column({ default: '', comment: '参数' })
  public params: string;

  @ApiProperty({ description: '操作类型' })
  @Column({ default: EnumOperationPerm.等于, enum: EnumOperationPerm, type: 'enum', comment: '操作类型' })
  public operation: EnumOperationPerm;

  public value1: string;
  public value2: string;

  @ApiProperty({ description: '顺序' })
  @Column({ type: 'tinyint', comment: '顺序' })
  public sort: number;

  // @OneToMany(() => DeptPermEntity, (deptPerms) => deptPerms.perms, {
  //   cascade: true,
  // })
  // public deptPerms: DeptPermEntity[];
}
