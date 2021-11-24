import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { ArticleEntity, DictionaryEntity, UserEntity } from '@entities';
import { CreateArticleDto } from './dto/create-article.dto';
import { EnumArticleEditorType, EnumArticleStatus } from '@common/enums';
import { PlatformError } from '@common/exceptions';
import { IPageParams } from '@interfaces/request.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { transformObjectExcludeEmpty } from '@utils/common';
import { plainToClass } from 'class-transformer';
import { DetailArticleDto } from './dto/detail-article.dto';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {
    super(articleRepository);
  }

  // 分页查询
  async pageList(params: Partial<ArticleEntity> & IPageParams) {
    const data = await this.basePageList(params, (qb) =>
      qb
        .addSelect('GROUP_CONCAT(dict.name) tagNames,user.nickname creatorName')
        .leftJoin(DictionaryEntity, 'dict', 'FIND_IN_SET(dict.id, tb.tags)')
        .leftJoin(UserEntity, 'user', 'tb.userId = user.id')
        .groupBy('tb.id'),
    );
    return {
      list: data.list.map((item) => plainToClass(DetailArticleDto, this.transformArticle(item, 'tb_'))),
      total: data.total,
    };
  }

  // 创建博客文章
  async createArticle(dto: CreateArticleDto) {
    // 通过验证， 插入数据
    const article = new ArticleEntity();
    Object.assign(
      article,
      { status: EnumArticleStatus.审核中, editorType: EnumArticleEditorType.MarkDown, tags: dto.tagList?.join(',') },
      dto,
    );
    const result = await this.insertAsync(article);
    if (result.raw.affectedRows > 0) {
      return '创建成功';
    }
    throw new PlatformError('创建失败');
  }

  // 修改博客文章
  async update({ tagList, ...dto }: UpdateArticleDto) {
    const entity = await this.articleRepository.findOne(dto.id);
    transformObjectExcludeEmpty(entity, dto);
    if (tagList && tagList.length > 0) {
      entity.tags = tagList.join(',');
    }
    if (entity.status === EnumArticleStatus.已发布) {
      entity.status = EnumArticleStatus.审核中;
    }
    const result = await this.updateAsync<Partial<ArticleEntity>>({
      id: entity.id,
      content: entity.content,
      coverImg: entity.coverImg,
      title: entity.title,
      tags: entity.tags,
      status: entity.status,
    });
    if (result.affected === 1) {
      return '修改成功';
    }
    throw new PlatformError('修改失败');
  }

  // 发布文章
  async releaseArticle(id: number) {
    const result = await this.updateAsync<Partial<ArticleEntity>>({
      id,
      status: EnumArticleStatus.已发布,
      publishTime: new Date(),
    });
    if (result.affected === 1) {
      return '发布成功';
    }
    throw new PlatformError('发布失败');
  }

  // 提交审核
  async submitApprove(id: number) {
    const result = await this.updateAsync<Partial<ArticleEntity>>({
      id,
      status: EnumArticleStatus.审核中,
    });
    if (result.affected === 1) {
      return '提审成功';
    }
    throw new PlatformError('提审失败');
  }

  // 删除文章
  async deleteArticle(ids: number[]) {
    const result = await this.deleteAsync(ids);
    if (result.affected > 0) {
      return '删除成功';
    }
    throw new PlatformError('删除失败');
  }

  // 文章详情
  async articleDetail(id: number) {
    const result = await this.articleRepository
      .createQueryBuilder('article')
      .addSelect('GROUP_CONCAT(dict.name) tagNames,user.nickname creatorName')
      .leftJoin(DictionaryEntity, 'dict', ' FIND_IN_SET(dict.id, article.tags)')
      .leftJoin(UserEntity, 'user', 'article.userId = user.id')
      .where('article.id = :id', { id })
      .groupBy('article.id')
      .getRawOne();

    return plainToClass(DetailArticleDto, this.transformArticle(result, 'article_'));
  }

  transformArticle(target: object, prefix: string) {
    const newObj = {};
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        const element = target[key];
        if (key.startsWith(prefix)) {
          newObj[key.substring(prefix.length)] = element;
        } else {
          newObj[key] = element;
        }
      }
    }
    return newObj;
  }
}
