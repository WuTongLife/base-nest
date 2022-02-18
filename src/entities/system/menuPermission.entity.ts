import { BaseEntity } from '@common/base/base.entity';
import { EnumMenuType } from '@common/enums/menuType';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleMenuPermEntity } from '../relationalEntities';

@Entity('sys_operation_perm')
export class MenuPermissionEntity extends BaseEntity {
  @ApiProperty({ description: '权限名称' })
  @Column({ type: 'varchar', name: 'perm_name', length: 40, comment: '权限名称' })
  public permName: string;

  @ApiProperty({ description: '父级ID' })
  @Column({ name: 'parend_id', default: 0, comment: '父级ID' })
  public parendId: number;

  @ApiProperty({ description: '描述' })
  @Column({ name: 'varchar', length: 200, nullable: true, comment: '描述' })
  public description: string;

  @Column({ type: 'varchar', comment: '权限标识，接口标识', nullable: true })
  public perms: string;

  @Column({ type: 'varchar', comment: '权限标识，接口标识', nullable: true })
  public icon: string;

  @Column({ type: 'varchar', comment: '重定向', nullable: true })
  public redirect: string;

  @Column({ name: 'perm_type', comment: '菜单类型： 1. 菜单/目录 2 操作', type: 'enum', enum: EnumMenuType })
  public permType: EnumMenuType;

  @OneToMany(() => RoleMenuPermEntity, (rolePerms) => rolePerms.perms, {
    cascade: true,
  })
  public rolePerms: RoleMenuPermEntity[];
}
