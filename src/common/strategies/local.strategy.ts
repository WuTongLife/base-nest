import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { UserEntity } from '@entities';
import { AuthService } from '@common/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({ passReqToCallback: true });
  }

  async validate(request: Request, username: string, password: string): Promise<Omit<UserEntity, 'password'>> {
    const contextId = ContextIdFactory.getByRequest(request);
    // console.log('Local-Strategy', username, password);
    // 现在 authService 是一个 request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(username, password);
    return user;
  }
}
