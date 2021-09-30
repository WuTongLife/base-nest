import { Module } from '@nestjs/common';
import { OSSService } from './oss.service';
import { OSSController } from './oss.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '@entities';

@Module({
  imports: [ConfigService, TypeOrmModule.forFeature([FileEntity])],
  providers: [OSSService, ConfigService], // 注入器实例化
  controllers: [OSSController],
  exports: [OSSService],
})
export class OSSModule {}
