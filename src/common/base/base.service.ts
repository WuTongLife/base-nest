import { Repository, InsertResult } from 'typeorm';

export class BaseService<T> {
  constructor(public repository: Repository<T>) {}

  async insertAsync(entity: T): Promise<InsertResult> {
    return this.repository.insert(entity);
  }
}
