import { Injectable, Inject } from '@nestjs/common';
import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSSBase } from './oss.base';
import * as OSS from 'ali-oss';
import { OSSOptions, File, UploadResult } from '@interfaces/oss.interface';
import { ConfigService } from '@nestjs/config';

/**
 * OSS
 * @export
 * @class OSSService
 */
@Injectable()
export class OSSService extends OSSBase {
  constructor(private readonly config: ConfigService) {
    super();
    this.options = {
      client: this.config.get('OSS'),
      domain: this.config.get('OSS.domain'),
    };
    this.ossClient = new OSS({
      accessKeyId: this.config.get('OSS.accessKeyId'),
      accessKeySecret: this.config.get('OSS.accessKeySecret'),
      region: this.config.get('OSS.region'),
      bucket: this.config.get('OSS.bucket'),
      endpoint: this.config.get('OSS.domain'),
      // internal: false, // 是否使用阿里云内部网访问
      // secure: true, // 使用 HTTPS
      cname: true, // 自定义endpoint
    });
  }

  /**
   * 流式下载
   * @param target
   */
  public async getStream(target: string): Promise<OSS.GetStreamResult> {
    return await this.ossClient.getStream(target);
  }

  /**
   * 删除
   * @param target
   */
  public async delete(target: string): Promise<NormalSuccessResponse> {
    return await this.ossClient.delete(target);
  }

  /**
   * 批量删除
   * @param target
   */
  public async deleteMulti(targets: string[]): Promise<DeleteMultiResult> {
    return await this.ossClient.deleteMulti(targets);
  }

  /**
   * 上传
   * @param file
   */
  public async upload(files: File | File[]): Promise<UploadResult[]> {
    //if (this.version >= 11.7 && this.options.multi) {
    //    return await this.uploadOSSMuit(files);
    //} else {
    return await this.uploadOSS(files);
    //}
  }
}
