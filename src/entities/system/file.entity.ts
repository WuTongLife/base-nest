import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '@src/common/base/base.entity';
import { Exclude } from 'class-transformer';

@Entity('sys_file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: true,
    length: 200,
    comment: '附件OSS地址',
    type: 'varchar',
  })
  @Exclude()
  public src: string;

  @Column({ length: 200, comment: '文件名' })
  public fileName: string;

  @Column({ nullable: true, default: null, length: 200, comment: '文件名存放地址' })
  public path: string;

  @Column({ comment: '上传状态(成功，失败)' })
  public status: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date;
}
