import { HTTP_STATUS, HttpStatus } from '../constants/app';

export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly isOperational: boolean;
  public readonly errors?: unknown[];

  constructor(statusCode: HttpStatus, message: string, errors?: unknown[], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const badRequest = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.BAD_REQUEST, message, errors);

export const unauthorized = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.UNAUTHORIZED, message, errors);

export const forbidden = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.FORBIDDEN, message, errors);

export const notFound = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.NOT_FOUND, message, errors);

export const conflict = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.CONFLICT, message, errors);

export const tooManyRequests = (message: string, errors?: unknown[]): AppError =>
  new AppError(HTTP_STATUS.TOO_MANY_REQUESTS, message, errors);
