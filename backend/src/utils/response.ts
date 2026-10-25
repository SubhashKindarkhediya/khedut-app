import { Response } from 'express';
import { HTTP_STATUS, HttpStatus } from '../constants/app';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export const sendSuccess = <T = unknown>(
  res: Response,
  message: string,
  data?: T,
  statusCode: HttpStatus = HTTP_STATUS.OK
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  });
};
