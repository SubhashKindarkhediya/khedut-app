/**
 * Extract typed array of values from a string enum or object.
 * Used to build DB CHECK constraints and Zod schemas from one source.
 */
export const enumValues = <T extends Record<string, string>>(e: T): T[keyof T][] =>
  Object.values(e) as T[keyof T][];
