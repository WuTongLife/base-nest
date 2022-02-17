import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '@interfaces/response.interface';

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> 未授权/权限验证失败
 */
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: TExceptionOption, error?: string) {
    super({
      code: HttpStatus.UNAUTHORIZED,
      msg: message || '未授权/权限验证失败',
      error,
    });
  }
}
