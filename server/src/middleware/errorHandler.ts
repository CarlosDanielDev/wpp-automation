import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, ErrorCode } from '@shared/types.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: ErrorCode;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'UNKNOWN_ERROR';

  const response: ApiResponse = {
    success: false,
    error: error.message || 'An unexpected error occurred',
    message: getErrorMessage(errorCode)
  };

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development') {
    (response as any).stack = error.stack;
    (response as any).details = error.details;
  }

  res.status(statusCode).json(response);
};

export const createError = (
  message: string,
  statusCode: number = 500,
  code: ErrorCode = 'UNKNOWN_ERROR',
  details?: any
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

const getErrorMessage = (code: ErrorCode): string => {
  const messages: Record<ErrorCode, string> = {
    FILE_UPLOAD_ERROR: 'File upload failed',
    FILE_PARSE_ERROR: 'Failed to parse the uploaded file',
    CONDITION_EVALUATION_ERROR: 'Error evaluating conditions',
    WHATSAPP_CONNECTION_ERROR: 'WhatsApp connection failed',
    WHATSAPP_SEND_ERROR: 'Failed to send WhatsApp message',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
    SESSION_EXPIRED: 'Session has expired',
    INVALID_PHONE_NUMBER: 'Invalid phone number format',
    TEMPLATE_RENDER_ERROR: 'Failed to render message template',
    JOB_NOT_FOUND: 'Job not found',
    UNKNOWN_ERROR: 'An unknown error occurred'
  };

  return messages[code] || messages.UNKNOWN_ERROR;
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next); 