import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { OSSService } from './oss.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
  async uploadFile(@UploadedFile() file): Promise<any> {
    return await this.ossService.upload(file);
  }

  /**
   * 上传图片到 本地 和 oss
   * @param body
   */
  @Post('/files')
  @ApiOperation({ summary: '多文件' })
  @UseInterceptors(FilesInterceptor('files[]'))
  async uploadFiles(@UploadedFiles() files): Promise<any> {
    return await this.ossService.upload(files);
  }

  /**
   * 生活图片
   * @param body
   */
  @Post('/life')
  @ApiOperation({ summary: '生活文件' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLifeFile(@UploadedFile() file): Promise<any> {
    return await this.ossService.upload(file, 'lifeImages');
  }
}
