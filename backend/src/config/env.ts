import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z
  .object({
    // Server
    PORT: z.coerce.number().int().positive().default(5000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CORS_ALLOWED_ORIGINS: z.string().optional(),

    // PostgreSQL
    DATABASE_URL: z
      .string()
      .regex(/^postgres(ql)?:\/\//, 'DATABASE_URL must start with postgresql:// or postgres://'),

    // MongoDB
    MONGO_URI: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, 'MONGO_URI must start with mongodb:// or mongodb+srv://'),

    // JWT
    JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // Bcrypt
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

    // Rate limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  })
  .superRefine((data, ctx) => {
    if (data.JWT_ACCESS_SECRET === data.JWT_REFRESH_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_REFRESH_SECRET'],
        message: 'JWT_REFRESH_SECRET must be different from JWT_ACCESS_SECRET',
      });
    }
    if (data.NODE_ENV === 'production' && !data.CORS_ALLOWED_ORIGINS) {
      ctx.addIssue({
        code: 'custom',
        path: ['CORS_ALLOWED_ORIGINS'],
        message: 'CORS_ALLOWED_ORIGINS is required in production',
      });
    }
  });

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error('Invalid environment variables:\n');
  _parsed.error.issues.forEach((issue) => {
    console.error(`  [${issue.path.join('.')}] ${issue.message}`);
  });
  console.error('\nFix the above issues in your .env file and restart.\n');
  process.exit(1);
}

const parsed = _parsed.data;

export const env = {
  ...parsed,
  CORS_ALLOWED_ORIGINS: (parsed.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

export type Env = typeof env;