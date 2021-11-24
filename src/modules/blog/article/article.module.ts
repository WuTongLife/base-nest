import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@entities';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { DictionaryModule } from '@modules/system/dictionary/dict.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), DictionaryModule],
  providers: [ArticleService], // 注入器实例化
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
