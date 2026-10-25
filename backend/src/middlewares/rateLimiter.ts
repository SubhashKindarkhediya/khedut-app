import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { env } from '../config/env';
import { HTTP_STATUS } from '../constants/app';
import { COMMON_ERROR_MESSAGES, AUTH_ERROR_MESSAGES } from '../constants/errorMessages';
import { sendError } from '../utils/response';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    sendError(res, COMMON_ERROR_MESSAGES.TOO_MANY_REQUESTS, HTTP_STATUS.TOO_MANY_REQUESTS);
  },
});

export interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}

export const createRateLimiter = (options?: RateLimiterOptions) => {
  const windowMs = options?.windowMs ?? 10 * 60 * 1000;
  const limit = options?.maxRequests ?? 5;
  const message = options?.message ?? COMMON_ERROR_MESSAGES.TOO_MANY_REQUESTS;

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      sendError(res, message, HTTP_STATUS.TOO_MANY_REQUESTS);
    },
  });
};

// Stricter rate limiter factory for OTP endpoints
export const createOtpRateLimiter = (
  windowMs = 10 * 60 * 1000,
  maxRequests = 3,
  message = AUTH_ERROR_MESSAGES.OTP_LIMIT_REACHED
) => createRateLimiter({ windowMs, maxRequests, message });

export default globalRateLimiter;
