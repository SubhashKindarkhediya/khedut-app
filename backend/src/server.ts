import { Server } from 'http';
import app from './app';
import { env } from './config/env';
import { connectPostgres, disconnectPostgres } from './config/postgres';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb';
import { logger } from './utils/logger';

let server: Server | null = null;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  try {
    // 1. Connect authoritative PostgreSQL
    await connectPostgres();

    // 2. Connect auxiliary MongoDB
    await connectMongoDB();

    // 3. Start Express HTTP listener
    server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} [NODE_ENV=${env.NODE_ENV}]`);
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to initialize server databases');
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, 'Graceful shutdown initiated');

  // Hard stop timeout in case of hanging connections (10 seconds)
  const shutdownTimeout = setTimeout(() => {
    logger.error('Shutdown deadline exceeded, forcing process exit');
    process.exit(1);
  }, 10_000);
  shutdownTimeout.unref();

  try {
    // 1. Stop accepting new HTTP requests
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      logger.info('HTTP server closed');
    }

    // 2. Disconnect databases cleanly
    await disconnectPostgres();
    await disconnectMongoDB();

    logger.info('All connections closed cleanly. Process exiting.');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during graceful shutdown');
    process.exit(1);
  }
}

// Signal handlers
process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

// Process-level unhandled errors
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ err: error }, 'Uncaught Exception');
  process.exit(1);
});

// Boot server
void startServer();
