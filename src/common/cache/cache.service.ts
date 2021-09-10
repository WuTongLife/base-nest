import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClient } from './redis-client.provider';

@Injectable()
export class CacheService {
  private client: Redis;

  onModuleInit(): void {
    console.log('程序执行');
    this.getClient();
  }

  private async getClient() {
    this.client = await RedisClient.getClient();
  }

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    // const data = await this.client.hgetall(key);
    if (data) return data;
    return null;
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    return await this.client.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushall(): Promise<any> {
    return await this.client.flushall();
  }
}
