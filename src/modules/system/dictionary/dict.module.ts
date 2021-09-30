import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryEntity } from '@entities';
import { DictionaryService } from './dict.service';
import { DictionaryController } from './dict.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEntity])],
  providers: [DictionaryService], // 注入器实例化
  controllers: [DictionaryController],
  exports: [DictionaryService],
})
export class DictionaryModule {}
