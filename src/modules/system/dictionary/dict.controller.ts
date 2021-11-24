import { IPageParams } from '@interfaces/request.interface';
import { Controller, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DictionaryService } from './dict.service';
import { CreateDictionaryDto } from './dto/create-dict.dto';
import { UpdateDictionaryDto } from './dto/update-dict.dto';

@ApiBearerAuth()
@ApiTags('字典管理')
@Controller('dict')
export class DictionaryController {
  constructor(private readonly dictService: DictionaryService) {}

  @Post('list')
  @ApiOperation({ summary: '字典列表' })
  async pageList(@Body() params: IPageParams) {
    return this.dictService.pageList(params);
  }

  @Post('create')
  @ApiOperation({ summary: '创建字典' })
  async createDictionary(@Body() dictDto: CreateDictionaryDto) {
    return this.dictService.create(dictDto);
  }

  @Post('update')
  @ApiOperation({ summary: '修改字典' })
  async updateDictionary(@Body() dictDto: UpdateDictionaryDto) {
    return this.dictService.update(dictDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除字典' })
  async deleteDictionary(@Body() body: { ids: number[] }) {
    return this.dictService.delete(body.ids);
  }
}
