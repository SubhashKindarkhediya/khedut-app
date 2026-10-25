import { Request, Response, NextFunction } from 'express';
import { notFound } from '../utils/appError';
import { COMMON_ERROR_MESSAGES } from '../constants/errorMessages';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(notFound(COMMON_ERROR_MESSAGES.ROUTE_NOT_FOUND));
};

export default notFoundHandler;
