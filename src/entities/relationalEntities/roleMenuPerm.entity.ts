import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { MenuPermissionEntity } from '../system/menuPermission.entity';
import { RoleEntity } from '../system/role.entity';

@Entity('sys_role_menu')
export class RoleMenuPermEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'perm_id' })
  permId: number;

  @ManyToOne(() => RoleEntity, (role) => role.rolePerms)
  @JoinColumn({ name: 'role_id' })
  roles: RoleEntity;

  @ManyToOne(() => MenuPermissionEntity, (perm) => perm.rolePerms)
  @JoinColumn({ name: 'perm_id' })
  perms: MenuPermissionEntity;
}
