import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { ArticleEntity } from '@entities';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {
    super(articleRepository);
  }

  async createArticle(articleDto: CreateArticleDto) {
    // 通过验证， 插入数据
    const article = new ArticleEntity();
    Object.assign(article, articleDto);
    // const result = this.articleRepository.create(article);
  }
}
