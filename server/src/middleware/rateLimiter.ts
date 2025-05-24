import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, consider using Redis)
const rateLimitStore = new Map<string, RateLimitInfo>();

// Rate limit configuration
const RATE_LIMITS = {
  general: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  upload: { requests: 5, windowMs: 60 * 1000 }, // 5 uploads per minute
  send: { requests: 30, windowMs: 60 * 1000 }, // 30 send requests per minute (WhatsApp safe)
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const endpoint = getEndpointType(req.path);
  const limit = RATE_LIMITS[endpoint];
  
  if (!limit) {
    return next();
  }

  const key = `${clientIp}:${endpoint}`;
  const now = Date.now();
  const windowStart = now - limit.windowMs;

  // Clean up old entries
  cleanup(windowStart);

  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    // First request or window has reset
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs
    });
    
    setRateLimitHeaders(res, limit.requests, limit.requests - 1, now + limit.windowMs);
    return next();
  }

  if (current.count >= limit.requests) {
    // Rate limit exceeded
    setRateLimitHeaders(res, limit.requests, 0, current.resetTime);
    
    const error = createError(
      `Rate limit exceeded. Maximum ${limit.requests} requests per ${limit.windowMs / 1000} seconds.`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
    
    return next(error);
  }

  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);
  
  setRateLimitHeaders(res, limit.requests, limit.requests - current.count, current.resetTime);
  next();
};

function getEndpointType(path: string): keyof typeof RATE_LIMITS {
  if (path.includes('/upload')) return 'upload';
  if (path.includes('/send') || path.includes('/messages')) return 'send';
  return 'general';
}

function setRateLimitHeaders(res: Response, limit: number, remaining: number, resetTime: number): void {
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
}

function cleanup(cutoff: number): void {
  for (const [key, info] of rateLimitStore.entries()) {
    if (info.resetTime < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}

// WhatsApp-specific rate limiter for message sending
export const whatsappRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `${clientIp}:whatsapp`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxMessages = 30; // Conservative limit to prevent WhatsApp bans

  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return next();
  }

  if (current.count >= maxMessages) {
    const error = createError(
      'WhatsApp rate limit exceeded. Please wait before sending more messages.',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
    return next(error);
  }

  current.count++;
  rateLimitStore.set(key, current);
  next();
};

// Cleanup job to prevent memory leaks
setInterval(() => {
  const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour ago
  cleanup(cutoff);
}, 5 * 60 * 1000); // Run every 5 minutes 