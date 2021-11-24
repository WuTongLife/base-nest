import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/common/base/base.service';
import { Repository } from 'typeorm';
import { DictionaryEntity } from '@entities';
import { CreateDictionaryDto } from './dto/create-dict.dto';
import { UpdateDictionaryDto } from './dto/update-dict.dto';
import { PlatformError } from '@common/exceptions';
import { IPageParams } from '@interfaces/request.interface';

@Injectable()
export class DictionaryService extends BaseService<DictionaryEntity> {
  constructor(
    @InjectRepository(DictionaryEntity)
    private readonly dictRepository: Repository<DictionaryEntity>,
  ) {
    super(dictRepository);
  }

  // 分页查询
  async pageList(params: Partial<DictionaryEntity> & IPageParams) {
    const data = await this.pageListFilter(params, { likes: ['name'] });
    return data;
  }

  // 创建字典
  async create(dto: CreateDictionaryDto) {
    const entity = new DictionaryEntity();
    Object.assign(entity, dto);
    const result = await this.insertAsync(entity);
    if (result.raw.affectedRows === 1) {
      return '创建成功';
    }
    throw new PlatformError('创建失败');
  }

  // 修改成功
  async update(dto: UpdateDictionaryDto) {
    const result = await this.updateAsync<DictionaryEntity>(dto);
    if (result.affected === 1) {
      return '修改成功';
    }
    throw new PlatformError('修改失败');
  }

  // 删除
  async delete(ids: number[]) {
    const result = await this.deleteAsync(ids);
    if (result.affected > 0) {
      return '删除成功';
    }
    throw new PlatformError('删除失败');
  }

  // 获取
  async getListByAliasKey(aliasKey: string) {
    const result = await this.dictRepository
      .createQueryBuilder('dict')
      .select('dict.id')
      .addSelect('dict.name')
      .where((qb) => {
        const sql = qb
          .subQuery()
          .select('dt.id')
          .from(DictionaryEntity, 'dt')
          .where('dt.aliasKey = :aliasKey')
          .getQuery();
        return `dict.parentId = ${sql}`;
      })
      .setParameter('aliasKey', aliasKey)
      .getMany();

    return result;
  }
}
