import { Public, User } from '@decorators';
import { IPageParams } from '@interfaces/request.interface';
import { DictionaryService } from '@modules/system/dictionary/dict.service';
import { Controller, Post, Body, Param, Put, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiBearerAuth()
@ApiTags('博客文章')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService, private readonly dictService: DictionaryService) {}

  @Post('list')
  @ApiOperation({ summary: '文章列表' })
  async pageList(@Body() params: IPageParams) {
    return this.articleService.pageList(params);
  }

  @Post('cteate')
  @ApiOperation({ summary: '创建文章' })
  create(@Body() body: CreateArticleDto, @User() user) {
    return this.articleService.createArticle({ ...body, userId: user.id });
  }

  @Put('update')
  @ApiOperation({ summary: '修改文章' })
  update(@Body() body: UpdateArticleDto) {
    return this.articleService.update(body);
  }

  @Put('release/:id')
  @ApiOperation({ summary: '发布文章' })
  releaseArticle(@Param('id') id: string) {
    return this.articleService.releaseArticle(Number(id));
  }

  @Put('approve/:id')
  @ApiOperation({ summary: '审核文章' })
  approveArticle(@Param('id') id: string) {
    return this.articleService.submitApprove(Number(id));
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '删除文章' })
  deleteArticle(@Param('id') id: string) {
    return this.articleService.deleteArticle([Number(id)]);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: '文章详情' })
  @Public()
  detailArticle(@Param('id') id: string) {
    return this.articleService.articleDetail(Number(id));
  }

  @Get('tags')
  @ApiOperation({ summary: '博客标签列表' })
  @Public()
  articleLabels() {
    return this.dictService.getListByAliasKey('blog_tag');
  }
}
