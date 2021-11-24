import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_collect')
export class DictionaryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', default: 0, comment: '网站类型' })
  public typeId: number;

  @Column({ type: 'varchar', length: 100, comment: '收藏网站名称' })
  public name: string;

  @Column({ type: 'varchar', length: 100, comment: '网站封面' })
  public coverImg: string;

  @Column({ type: 'varchar', length: 100, comment: '收藏网站链接' })
  public link: string;

  @Column({ type: 'varchar', length: 300, comment: '描述' })
  public description: string;
}
