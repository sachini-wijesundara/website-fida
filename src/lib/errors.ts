/**
 * src/lib/errors.ts
 *
 * Standardized error classes for use across API routes and server actions.
 * Keeps HTTP status codes and user-facing messages consistent project-wide.
 */

import { NextResponse } from "next/server";

// ─── Base App Error ───────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ─── Specific Error Types ─────────────────────────────────────────────────────

/** 400 – Client sent invalid or missing data */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/** 401 – Not authenticated */
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/** 403 – Authenticated but not permitted */
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/** 404 – Resource not found */
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/** 429 – Rate limit exceeded */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

// ─── API Error Response Helper ────────────────────────────────────────────────

/**
 * Converts any caught error into a consistent JSON API response.
 * Use this inside every API route's catch block.
 *
 * @example
 * } catch (err) {
 *   return handleApiError(err);
 * }
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // Unknown / unexpected errors
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  console.error("[API Error]", error);
  return NextResponse.json({ message }, { status: 500 });
}
