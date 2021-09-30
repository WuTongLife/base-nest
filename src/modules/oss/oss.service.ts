import { Injectable } from '@nestjs/common';
import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSSBase } from './oss.base';
import * as OSS from 'ali-oss';
import { File, UploadResult } from '@interfaces/oss.interface';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from '@src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * OSS
 * @export
 * @class OSSService
 */
@Injectable()
export class OSSService extends OSSBase {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly config: ConfigService,
  ) {
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
  public async upload(files: File | File[], dir?: string): Promise<UploadResult[]> {
    const result = await this.uploadOSS(files, dir);
    // 存到文件记录里
    const fileEntities = result.map((d) =>
      Object.assign(new FileEntity(), { path: d.path, status: d.uploaded, src: d.src, fileName: d.fileName }),
    );
    const records = await this.fileRepository.save(fileEntities);
    return result.map((d) => {
      const record = records.find((f) => f.fileName === d.fileName);
      return {
        ...d,
        id: record?.id,
      };
    });
  }
}
