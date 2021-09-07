import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const format = winston.format;
const { colorize } = format;
const rawFormat = format.printf((info) => {
  return `${customColor(`[${info.timestamp}]`).GREEN} ${info.level}: ${info.message}`;
});

export const loggerFormat = (parmas: {
  originalUrl?: string;
  method?: string;
  ip?: string;
  status?: string;
  exception?: string;
  user?: any;
  body?: any;
  params?: any;
  query?: any;
  responseData?: any;
  message?: string;
  [key: string]: any;
}) => {
  if (!parmas.originalUrl) {
    return parmas.message;
  }
  return `
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${parmas.originalUrl}
    Method: ${parmas.method}
    IP: ${parmas.ip}
    Status code: ${parmas.status}
    User: ${JSON.stringify(parmas.user)}
    Body: ${JSON.stringify(parmas.body)}
    Parmas: ${JSON.stringify(parmas.params)}
    Query: ${JSON.stringify(parmas.query)}
    Response data:${JSON.stringify(parmas.responseData)}
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  `;
};

const colorMessage = colorize({ all: true });
const customColor = (message: string) => ({
  GREEN: colorMessage.colorize('info', message),
});

export const loggerOptions: winston.LoggerOptions = {
  exitOnError: false,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.splat(),
    format.printf((info) => {
      return `[${info.timestamp}] [${info.level}]: ${loggerFormat(info)}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      format: format.combine(colorMessage, rawFormat),
    }),
    new winston.transports.Http({
      level: 'warn',
      format: winston.format.json(),
    }),
    new DailyRotateFile({
      filename: 'logs/info/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      level: 'info',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/errors/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};
