import { Controller, Post, ClassSerializerInterceptor, UseInterceptors, Request, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DictionaryService } from './dict.service';

@ApiBearerAuth()
@ApiTags('字典管理')
@Controller('dict')
export class DictionaryController {
  constructor(private readonly dictService: DictionaryService) {}
}
