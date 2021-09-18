import { Controller, Post, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { OSSService } from './oss.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('upload')
@Controller('upload')
export class OSSController {
  constructor(private readonly ossService: OSSService) {}

  /**
   * 上传图片到 本地 和 oss
   * @param body
   */
  @Post('/file')
  @ApiOperation({ summary: '文件' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any): Promise<any> {
    return await this.ossService.upload(file);
  }

}
