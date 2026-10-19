// =============================================================================
// Application-wide constants
// Imported everywhere instead of magic strings / numbers
// =============================================================================

// -----------------------------------------------------------------------------
// HTTP Status Codes
// -----------------------------------------------------------------------------
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 3xx Redirection
  NOT_MODIFIED: 304,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// -----------------------------------------------------------------------------
// User Roles
// -----------------------------------------------------------------------------
export enum UserRole {
  FARMER = 'farmer',
  PARTNER = 'partner',
  ADMIN = 'admin',
}

// -----------------------------------------------------------------------------
// Currency
// -----------------------------------------------------------------------------
export const DEFAULT_CURRENCY = 'INR' as const;
export type CurrencyCode = 'INR';

// -----------------------------------------------------------------------------
// Pagination Defaults
// -----------------------------------------------------------------------------
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// -----------------------------------------------------------------------------
// Soft-Delete
// All tables use deleted_at (null = active, timestamp = deleted)
// -----------------------------------------------------------------------------
export const SOFT_DELETE_COLUMN = 'deleted_at' as const;

// -----------------------------------------------------------------------------
// Supported Locales
// -----------------------------------------------------------------------------
export enum Locale {
  EN = 'en',
  GU = 'gu',
  HI = 'hi',
}

export const DEFAULT_LOCALE = Locale.EN;

// -----------------------------------------------------------------------------
// API Version Prefix
// -----------------------------------------------------------------------------
export const API_PREFIX = '/api/v1' as const;
