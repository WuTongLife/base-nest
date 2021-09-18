import * as OSS from 'ali-oss';

export interface UploadResult {
  uploaded: boolean;
  path: string;
  src: string;
  srcSign?: string;
  message: string;
}

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface OSSSucessResponse {
  name: string;
  url?: string;
  res: OSS.NormalSuccessResponse;
  size?: number;
  aborted?: boolean;
  rt?: number;
  keepAliveSocket?: boolean;
  data?: Buffer;
  requestUrls?: string[];
  timing?: null;
  remoteAddress?: string;
  remotePort?: number;
  socketHandledRequests?: number;
  socketHandledResponses?: number;
}

export interface ClientSign {
  name?: string;
  key?: string;
  policy: string;
  OSSAccessKeyId: string;
  success_action_status?: number;
  signature: string;
}

export interface OSSOptions {
  client: OSS.Options;
  domain?: string;
}
