import * as Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { RedisModuleOptions } from './redis.interface';

export class RedisClientError extends Error {}

export class RedisClient {
  static defaultKey: string = uuidv4();
  static clients: Map<string, Redis.Redis> = new Map<string, Redis.Redis>();
  static size: number;
  static redisIndex: [];

  static async getClient(name?: string): Redis {
    if (!name) {
      name = this.defaultKey;
    }
    if (!this.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.clients.get(name);
  }

  static async initClient(options: RedisModuleOptions): Promise<Redis.Redis> {
    const { onClientReady, url, ...opt } = options;
    const client = url ? new Redis(url) : new Redis(opt);
    if (onClientReady) {
      onClientReady(client);
    }
    return client;
  }

  static async createClient(options: RedisModuleOptions | RedisModuleOptions[]) {
    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async (o) => {
          const key = o.name || this.defaultKey;
          if (this.clients.has(key)) {
            throw new RedisClientError(`${o.name || 'default'} client is exists`);
          }
          this.clients.set(key, await this.initClient(o));
        }),
      );
    } else {
      if (options.name && options.name.length !== 0) {
        this.defaultKey = options.name;
      }
      this.clients.set(this.defaultKey, await this.initClient(options));
      this.size = this.clients.size;
    }
  }
}
