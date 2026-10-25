import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { API_PREFIX } from './constants/app';
import { logger } from './utils/logger';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS configuration (allow mobile apps/Postman with no origin, and configured origins)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging with sensitive data redaction
app.use(
  pinoHttp({
    logger,
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
  })
);

// Global IP rate limiting
app.use(globalRateLimiter);

// Direct root / health alias for convenience
app.get('/health', (_req: Request, res: Response) => {
  res.redirect(`${API_PREFIX}/health`);
});

// Central API routes mounted under API_PREFIX (/api/v1)
app.use(API_PREFIX, routes);

// 404 Catch-all handler
app.use(notFoundHandler);

// Central error handler (must be last)
app.use(errorHandler);

export default app;
