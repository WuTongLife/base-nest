import { UserEntity } from '@entities';
import { IPageParams, IPageWhere } from '@interfaces/request.interface';
import { IHttpResultPaginate } from '@interfaces/response.interface';
import { Repository, InsertResult, UpdateResult, SelectQueryBuilder, DeleteResult } from 'typeorm';

const PAGE_PARAMS = ['current', 'pageSize', 'sortField', 'sortDirection'];
export class BaseService<T> {
  constructor(private repository: Repository<T>) {}

  protected async basePageList(
    params: IPageParams,
    callback?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<IHttpResultPaginate<T[]>> {
    const { pageSize, current, sortDirection, sortField } = params;
    let qb = this.repository.createQueryBuilder('tb');
    // 筛选条件
    if (callback) {
      qb = callback(qb);
    }
    // 排序
    if (sortField && sortDirection) {
      qb = qb.orderBy(`tb.${sortField}`, sortDirection);
    }
    // 分页
    qb = qb.limit(pageSize).offset((current - 1) * pageSize);
    const result = await qb.getRawMany();
    const count = await qb.getCount();
    return {
      list: result,
      total: count,
    };
  }

  // 封装模糊查询和时间区间查询
  protected async pageListFilter(params: IPageParams, whereParams: IPageWhere) {
    const { likes = [], times = [] } = whereParams;
    return this.basePageList(params, (qb) => {
      likes.forEach((like) => {
        if (params[like]) {
          qb = qb.where(`tb.${like} like :name`, { name: '%' + params[like] + '%' });
        }
      });
      times.forEach(({ field, start, end }) => {
        if (start || end) {
          qb = qb.andWhere(`${field} BETWEEN :start AND :end`, { start, end });
        }
      });
      return qb;
    });
  }

  protected async insertAsync(entity: T): Promise<InsertResult> {
    return this.repository.insert(entity);
  }

  protected async updateAsync<D>(entity: D): Promise<UpdateResult> {
    return this.repository.update(entity['id'], entity);
  }

  protected async deleteAsync(ids: number[]): Promise<DeleteResult> {
    return this.repository.delete(ids);
  }
}
