import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { DataPermissionEntity } from '../system/dataPermission.entity';
import { DeptEntity } from '../system/department.entity';

// @Entity('sys_dept_perm')
export class DeptPermEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dept_id' })
  deptId: number;

  @Column({ name: 'perm_id' })
  permId: number;

  // @ManyToOne(() => DeptEntity, (dept) => dept.deptPerms)
  // @JoinColumn({ name: 'dept_id' })
  // depts: DeptEntity;

  // @ManyToOne(() => DataPermissionEntity, (perm) => perm.deptPerms)
  // @JoinColumn({ name: 'perm_id' })
  // perms: DataPermissionEntity;
}
