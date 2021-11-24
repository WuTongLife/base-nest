import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { BaseEntity } from '@src/common/base/base.entity';
import { EnumArticleEditorType, EnumArticleStatus } from '@common/enums';

@Entity('blog_article')
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', comment: '创建用户' })
  public userId: number;

  @Column({ length: 100, comment: '文章标题' })
  public title: string;

  @Column({ type: 'text', comment: '文章内容' })
  public content: string;

  @Column({ nullable: true, type: 'varchar', length: 100, comment: '文章封面' })
  public coverImg: string;

  @Column({ nullable: true, type: 'varchar', length: 20, comment: '文章标签' })
  public tags: string;

  @Column({ type: 'enum', default: EnumArticleStatus.草稿, enum: EnumArticleStatus, comment: '文章状态' })
  public status: EnumArticleStatus;

  @Column({ nullable: true, default: 0, type: 'int', comment: '浏览量' })
  public views: number;

  @Column({
    nullable: true,
    default: EnumArticleEditorType.MarkDown,
    type: 'enum',
    enum: EnumArticleEditorType,
    comment: '编辑器类型',
  })
  public editorType: EnumArticleEditorType;

  @Column({ nullable: true, type: 'timestamp', comment: '发布时间' })
  public publishTime: Date;
}
