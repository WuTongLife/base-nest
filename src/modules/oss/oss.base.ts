import { createHmac } from 'crypto';
import * as stream from 'stream';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as OSS from 'ali-oss';
import { OSSOptions, OSSSucessResponse, UploadResult, ClientSign, File } from '@interfaces/oss.interface';
import { ValidationError } from '@common/exceptions';

export class OSSBase {
  protected ossClient: OSS;
  protected options: OSSOptions;
  protected version = parseFloat(process.versions.node);

  /**
   * 流式上传
   * @param target
   * @param imageStream
   */
  protected async putStream(target: string, imageStream: stream.PassThrough): Promise<OSSSucessResponse> {
    return await this.ossClient.putStream(target, imageStream);
  }

  /**
   * 上传到OSS
   * @param file
   */
  protected async uploadOSS(file: File | File[], dir?: string) {
    const result: UploadResult[] = [];
    let files: File[] = [];

    if (Array.isArray(file)) {
      files = file;
    } else {
      files = [file];
    }

    const fileNames = new Set(files.map((d) => d.originalname));
    if (fileNames.size !== files.length) {
      throw new ValidationError('文件名存在相同的');
    }

    if (files && files.length > 0) {
      for (const item of files) {
        const filename = this.getImgName(item.originalname);
        const imgPath = `${dir || 'images'}/${dayjs().format('YYYYMMDD')}`;
        const target = imgPath + '/' + filename;
        const info: UploadResult = {
          uploaded: true,
          path: '',
          src: '',
          fileName: item.originalname,
          // srcSign: '',
          message: '上传成功',
        };

        try {
          const imageStream = new stream.PassThrough();
          imageStream.end(item.buffer);
          const uploadResult = await this.putStream(target, imageStream);

          if (uploadResult.res.status === 200) {
            info.path = uploadResult.name;
            info.src = uploadResult.url || '';
            // info.srcSign = this.getOssSign(info.src); // 签名
          }
        } catch (error) {
          console.error('error', error);
          info.uploaded = false;
          info.path = item.originalname;
          info.message = '上传失败';
        }

        result.push(info);
      }
    }

    return result;
  }

  /**
   * 生成文件名(按时间)
   * @param {*} filename
   */
  protected getImgName(filename: string) {
    const name = `${dayjs().format('HHmmss')}${Math.floor(Math.random() * 100)}${path.extname(filename).toLowerCase()}`;

    return name;
  }

  /**
   * 获取私密bucket访问地址
   * @param {*} url
   * @param {*} width
   * @param {*} height
   */
  public getOssSign(url: string, width?: number, height?: number) {
    let target = url;
    // 拼装签名后访问地址
    let urlReturn = '';

    if (url) {
      const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
      const isSelfUrlX: string = this.options.domain || '';
      // 判断是否包含有效地址
      if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
        let targetArray: string[] = [];
        if (url.indexOf('?') > 0) {
          targetArray = url.split('?');
          target = targetArray[0];
        }
        targetArray = target.split('com/');
        target = targetArray[1];
      } else {
        return url;
      }
      // 读取配置初始化参数
      const accessId = this.options.client.accessKeyId;
      const accessKey = this.options.client.accessKeySecret;
      let endpoint = `${this.options.client.bucket}.${this.options.client.endpoint}`;
      const signDateTime = parseInt(String(dayjs().unix()), 10);
      const outTime = 2 * 3600; // 失效时间
      const expireTime = signDateTime + outTime;

      if (this.options.domain) {
        endpoint = this.options.domain;
      }

      // 拼装签名字符串
      let toSignString = '';
      toSignString = 'GET\n';
      const md5 = '';
      toSignString = `${toSignString}${md5}\n`;
      const contentType = '';
      toSignString = `${toSignString}${contentType}\n`;
      toSignString = `${toSignString}${expireTime}\n`;
      let resource = '';

      if (width && height) {
        resource = `/${this.options.client.bucket}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0`;
      } else {
        resource = `/${this.options.client.bucket}/${target}`;
      }

      const ossHeaders = '';
      toSignString = toSignString + ossHeaders;
      toSignString = toSignString + resource;

      // hmacsha1 签名
      const sign = encodeURIComponent(createHmac('sha1', accessKey).update(toSignString).digest('base64'));

      const ossURL = this.ossClient.signatureUrl(`${target}`, { expires: 3600 });
      console.log(ossURL);

      if (width && height) {
        urlReturn = `https://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
      } else {
        urlReturn = `https://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
      }
    }

    return urlReturn;
  }

  /**
   * 前端直传签名
   */
  public getUploadSgin() {
    const policyText = {
      expiration: `${dayjs().add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss')}.000Z`, // 设置Policy的失效时间
      conditions: [
        ['content-length-range', 0, 50048576000], // 设置上传文件的大小限制
      ],
    };
    const policyBase64 = Buffer.from(JSON.stringify(policyText)).toString('base64');
    const uploadSignature = createHmac('sha1', this.options.client.accessKeySecret)
      .update(policyBase64)
      .digest('base64');

    const params: ClientSign = {
      policy: policyBase64,
      OSSAccessKeyId: this.options.client.accessKeyId,
      signature: uploadSignature,
    };

    return params;
  }
}
