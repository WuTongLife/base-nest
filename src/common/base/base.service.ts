import { Repository, InsertResult, UpdateResult } from 'typeorm';

export class BaseService<T> {
  constructor(public repository: Repository<T>) {}

  async insertAsync(entity: T): Promise<InsertResult> {
    return this.repository.insert(entity);
  }

  async updateAsync(entity: Partial<T> & { id: number }, keys: string[]): Promise<UpdateResult> {
    const obj = {};
    keys.forEach((v) => {
      obj[v] = entity[v];
    });
    return this.repository.update(entity.id, obj);
  }
}
