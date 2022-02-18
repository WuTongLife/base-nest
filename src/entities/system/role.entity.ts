import { BaseEntity } from '@common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRoleEntity, RoleMenuPermEntity } from '../relationalEntities';

@Entity('sys_role')
export class RoleEntity extends BaseEntity {
  @ApiProperty({ description: '角色名称' })
  @Column({ type: 'varchar', name: 'role_name', length: 40, comment: '角色名称' })
  public roleName: string;

  @ApiProperty({ description: '父级ID' })
  @Column({ name: 'parend_id', default: 0, comment: '父级ID' })
  public parendId: number;

  @ApiProperty({ description: '角色描述' })
  @Column({ name: 'varchar', length: 200, nullable: true, comment: '角色描述' })
  public description: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.roles, {
    cascade: true,
  })
  public userRoles: UserRoleEntity[];

  @OneToMany(() => RoleMenuPermEntity, (userRole) => userRole.roles, {
    cascade: true,
  })
  public rolePerms: RoleMenuPermEntity[];
}
