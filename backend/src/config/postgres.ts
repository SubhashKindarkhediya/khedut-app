import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

// NOTE: pg returns NUMERIC as string by default. Keep it that way.
// Never convert money values to JS numbers/floats.
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// An idle client failed. pg removes it from the pool automatically,
// so we only log. Do NOT exit the process.
pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PostgreSQL pool error');
});

export async function connectPostgres(): Promise<void> {
  await pool.query('SELECT 1');
  logger.info('PostgreSQL connected');
}

export async function disconnectPostgres(): Promise<void> {
  await pool.end();
  logger.info('PostgreSQL pool closed');
}

export async function isPostgresHealthy(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  let releaseError: Error | undefined;
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      // Connection is broken: destroy it instead of returning it to the pool
      releaseError = rollbackErr as Error;
    }
    throw err; // always rethrow the ORIGINAL error
  } finally {
    client.release(releaseError);
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(sql, params);
}
