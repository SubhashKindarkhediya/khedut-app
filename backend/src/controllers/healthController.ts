import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP_STATUS } from '../constants/app';
import { COMMON_SUCCESS_MESSAGES } from '../constants/successMessages';
import { COMMON_ERROR_MESSAGES } from '../constants/errorMessages';
import { isPostgresHealthy } from '../config/postgres';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const isPostgresUp = await isPostgresHealthy();
  const isMongoUp = mongoose.connection.readyState === 1;

  const services = {
    postgres: isPostgresUp ? 'connected' : 'disconnected',
    mongodb: isMongoUp ? 'connected' : 'disconnected',
  };

  if (!isPostgresUp || !isMongoUp) {
    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      success: false,
      message: COMMON_ERROR_MESSAGES.SERVICE_UNAVAILABLE,
      data: { services },
    });
  }

  return sendSuccess(res, COMMON_SUCCESS_MESSAGES.HEALTH_OK, { services });
});
