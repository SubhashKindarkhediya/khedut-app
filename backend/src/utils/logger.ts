import pino from 'pino';
import { env } from '../config/env';

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'headers.authorization',
      'authorization',
      'password',
      'token',
      'refreshToken',
      'otp',
      '*.password',
      '*.token',
      '*.refreshToken',
      '*.otp',
      'body.password',
      'body.token',
      'body.refreshToken',
      'body.otp',
    ],
    censor: '[REDACTED]',
  },
});

export default logger;
