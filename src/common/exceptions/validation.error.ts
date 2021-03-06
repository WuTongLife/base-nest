import { HttpException, HttpStatus } from '@nestjs/common';
import { VALIDATION_ERROR } from '@constants/error/general.constant';
import { TExceptionOption } from '@interfaces/response.interface';
import { isString } from 'lodash';

/**
 * @class ValidationError
 * @classdesc 400 -> 请求有问题，这个错误经常发生在错误内层，所以 code 没有意义
 */
export class ValidationError extends HttpException {
  constructor(error?: TExceptionOption) {
    super(isString(error) ? { ...VALIDATION_ERROR, msg: error } : error || VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
  }
}
