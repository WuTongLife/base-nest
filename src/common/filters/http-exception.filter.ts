import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';
import { NOT_FOUND_ERROR, DEFAULT_ERROR } from '@constants/error/general.constant';
import { TExceptionOption, THttpErrorResponse } from '@interfaces/response.interface';
import { isString } from 'lodash';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error({
      message: exception.getResponse(),
      originalUrl: request.originalUrl,
      method: request.method,
      ip: request.ip,
      status,
      user: request['user'],
      body: request.body,
      query: request.query,
      params: request.params,
      responseData: exception.getResponse(),
    });

    try {
      const errorOption: TExceptionOption = exception.getResponse() as TExceptionOption;
      const errCode = isString(errorOption) ? NOT_FOUND_ERROR.code : errorOption.code || NOT_FOUND_ERROR.code;
      const errMessage = isString(errorOption) ? errorOption : errorOption.msg;
      const errorInfo = isString(errorOption) ? null : errorOption.error;
      const parentErrorInfo = errorInfo ? String(errorInfo) : null;
      const isChildrenError = errorInfo && errorInfo.code && errorInfo.msg;
      const resultError = (isChildrenError && errorInfo.msg) || parentErrorInfo;
      const data: THttpErrorResponse = {
        code: errCode,
        msg: errMessage,
        error: resultError,
      };
      // 对默认的 404 进行特殊处理
      if (status === HttpStatus.NOT_FOUND) {
        data.error = `资源不存在`;
        data.msg = `接口 ${request.method} -> ${request.url} 无效`;
      }

      return response.status(status).send(data);
    } catch (err) {
      return response.status(status).send(DEFAULT_ERROR);
    }
  }
}
