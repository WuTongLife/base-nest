import { registerAs } from '@nestjs/config';

export default registerAs('OSS', () => ({
  accessKeyId: process.env.OSS_ACCESSKEYID,
  accessKeySecret: process.env.OSS_ACCESSKEYSECRIET,
  region: process.env.OSS_REGION,
  bucket: process.env.OSS_BUCKET,
  endpoint: process.env.OSS_ENDPOINT,
  location: process.env.UPLOAD_LOCATION,
  fileSize: process.env.UPLOAD_FILESIZE,
  internal: false, // 是否使用阿里云内部网访问
  secure: true, // 使用 HTTPS
  cname: true, // 自定义endpoint
  timeout: '90s',
  domain: process.env.OSS_DOMAIN,
}));
