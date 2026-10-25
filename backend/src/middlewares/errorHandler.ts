import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/app';
import { COMMON_ERROR_MESSAGES } from '../constants/errorMessages';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // 1. Zod Validation Error (422)
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    logger.warn({ path: req.path, method: req.method, errors: fieldErrors }, 'Validation error');
    sendError(
      res,
      COMMON_ERROR_MESSAGES.VALIDATION_FAILED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      fieldErrors
    );
    return;
  }

  // 2. Custom AppError (operational)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path, method: req.method }, err.message);
    } else {
      logger.warn({ path: req.path, method: req.method, statusCode: err.statusCode }, err.message);
    }
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // 3. Invalid JSON Body Syntax Error (400)
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: unknown }).status === 400 &&
    'body' in err
  ) {
    logger.warn({ path: req.path, method: req.method }, 'Malformed JSON body');
    sendError(res, COMMON_ERROR_MESSAGES.INVALID_JSON_BODY, HTTP_STATUS.BAD_REQUEST);
    return;
  }

  // 4. Unknown / Internal Server Error (500)
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled application error');

  const isProduction = env.NODE_ENV === 'production';
  const message = isProduction
    ? COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    : err instanceof Error
      ? err.message
      : COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  const errors = isProduction
    ? undefined
    : err instanceof Error && err.stack
      ? [err.stack]
      : undefined;

  sendError(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errors);
};

export default errorHandler;
