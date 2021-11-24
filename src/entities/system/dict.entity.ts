import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('sys_dict')
export class DictionaryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', default: 0, comment: '父级Id' })
  public parentId: number;

  @Column({ type: 'varchar', length: 100, comment: '名称' })
  public name: string;

  @Column({ type: 'varchar', length: 100, comment: '关键字' })
  @Index({ unique: true })
  public aliasKey: string;

  @Column({ nullable: true, type: 'varchar', length: 300, comment: '描述' })
  public description?: string;
}
