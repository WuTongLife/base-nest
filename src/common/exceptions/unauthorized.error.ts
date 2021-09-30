import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { LOGGING_TIMEOUT } from '@constants/error/general.constant';
import { TExceptionOption } from '@interfaces/response.interface';
import { isString } from 'lodash';

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> 未授权/权限验证失败
 */
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: TExceptionOption, error?: string) {
    super(isString(message) ? { ...LOGGING_TIMEOUT, msg: message } : message || LOGGING_TIMEOUT, error);
  }
}
