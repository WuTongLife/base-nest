import { Controller, Post, Request, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@ApiBearerAuth()
@ApiTags('博客文章')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('cteate')
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() articleDto: CreateArticleDto, @Request() req) {
    console.log(req);
    return this.articleService.createArticle(articleDto);
  }
}
