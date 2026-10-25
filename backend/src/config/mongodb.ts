import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Connect — called once on server startup
// ---------------------------------------------------------------------------
export async function connectMongoDB(): Promise<void> {
  await mongoose.connect(env.MONGO_URI, {
    // Recommended settings for production-ready connections
    serverSelectionTimeoutMS: 5_000,
    socketTimeoutMS: 45_000,
  });
  logger.info('MongoDB connected');
}

// ---------------------------------------------------------------------------
// Disconnect — called on graceful shutdown
// ---------------------------------------------------------------------------
export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
}

// ---------------------------------------------------------------------------
// Mongoose global settings
// ---------------------------------------------------------------------------

// Throw errors on queries using undefined fields (safer schema enforcement)
mongoose.set('strictQuery', true);
