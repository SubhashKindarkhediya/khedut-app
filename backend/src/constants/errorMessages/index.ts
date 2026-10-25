// =============================================================================
// Application Error Messages
// Centralized definitions — do not import env, database, or external libraries.
// =============================================================================

// ===== COMMON =====
export enum COMMON_ERROR_MESSAGES {
  INTERNAL_SERVER_ERROR = 'Internal server error',
  ROUTE_NOT_FOUND = 'Route not found',
  VALIDATION_FAILED = 'Validation failed',
  INVALID_JSON_BODY = 'Invalid JSON payload in request body',
  TOO_MANY_REQUESTS = 'Too many requests, please try again later',
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Forbidden resource',
  RESOURCE_NOT_FOUND = 'Resource not found',
  SERVICE_UNAVAILABLE = 'Service unavailable',
}

// ===== AUTH =====
export enum AUTH_ERROR_MESSAGES {
  INVALID_MOBILE_NUMBER = 'Invalid mobile number format',
  OTP_RESEND_TOO_SOON = 'Please wait before requesting another OTP',
  OTP_LIMIT_REACHED = 'Maximum OTP request limit reached. Please try again later',
  INVALID_OR_EXPIRED_OTP = 'Invalid or expired OTP',
  OTP_ATTEMPTS_EXCEEDED = 'Maximum OTP verification attempts exceeded. Please request a new OTP',
  ACCOUNT_BLOCKED = 'Your account has been blocked. Please contact support',
  UNAUTHORIZED = 'Authentication required',
  INVALID_ACCESS_TOKEN = 'Invalid or expired access token',
  INVALID_REFRESH_TOKEN = 'Invalid or expired refresh token',
  SESSION_REVOKED = 'Session has been revoked',
}
