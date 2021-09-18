import { Module } from '@nestjs/common';
import { OSSService } from './oss.service';
import { OSSController } from './oss.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  providers: [OSSService, ConfigService], // 注入器实例化
  controllers: [OSSController],
  exports: [OSSService],
})
export class OSSModule {}
