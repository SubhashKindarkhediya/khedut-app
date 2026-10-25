// =============================================================================
// Application Success Messages
// Centralized definitions — do not import env, database, or external libraries.
// =============================================================================

// ===== COMMON =====
export enum COMMON_SUCCESS_MESSAGES {
  HEALTH_OK = 'Backend is running',
}

// ===== AUTH =====
export enum AUTH_SUCCESS_MESSAGES {
  OTP_SENT = 'OTP sent successfully',
  LOGIN_SUCCESS = 'Login successful',
  TOKEN_REFRESHED = 'Token refreshed successfully',
  LOGOUT_SUCCESS = 'Logged out successfully',
  PROFILE_FETCHED = 'Profile fetched successfully',
}

// Legacy aliases for existing health endpoint
export const SuccessMessage = {
  BACKEND_RUNNING: COMMON_SUCCESS_MESSAGES.HEALTH_OK,
} as const;

export const SuccessStatus = {
  OK: 'ok',
} as const;
