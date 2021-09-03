import { registerAs } from '@nestjs/config';

export default registerAs('OSS', () => ({
  accessKeyId: process.env.OSS_ACCESSKEYID,
  accessKeySecret: process.env.OSS_ACCESSKEYSECRIET,
  region: process.env.OSS_REGION,
  bucket: process.env.OSS_BUCKET,
  location: process.env.UPLOAD_LOCATION,
  fileSize: process.env.UPLOAD_FILESIZE,
}));
