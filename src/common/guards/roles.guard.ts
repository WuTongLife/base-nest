import { PERMISSION_KEY } from '@common/decorators';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 没使用权限守卫的直接放行  @Permissions('sys_user:list')
    const currentPerm = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!currentPerm) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user: { id: number; username: string } = request['user'];
    if (!user) return true;
    // 当前请求所需权限
    const currentReqUrl = request.url;
    // 空，标识不需要权限
    if (user.username === 'admin') return true;

    return true;
  }
}
