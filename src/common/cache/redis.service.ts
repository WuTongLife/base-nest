import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from './redis-client.provider';

@Injectable()
export class RedisService {
  constructor(private readonly configService: ConfigService) {
    RedisClient.createClient([this.configService.get('redis')]);
  }
}
