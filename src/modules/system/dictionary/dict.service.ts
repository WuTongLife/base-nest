import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { DictionaryEntity } from '@entities';

@Injectable()
export class DictionaryService extends BaseService<DictionaryEntity> {
  constructor(
    @InjectRepository(DictionaryEntity)
    private readonly dictRepository: Repository<DictionaryEntity>,
  ) {
    super(dictRepository);
  }
}
