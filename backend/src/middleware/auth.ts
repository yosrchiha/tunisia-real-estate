import { createMiddleware } from 'hono/factory';
import { verifyToken } from '../services/authService';
import type { AuthEnv } from '../types/index';

/**
 * Middleware to check if user is authenticated
 */
export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {   
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    c.set('user', decoded);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
});

/**
 * Middleware to check if user has a specific role
 */
export const requireRole = (roleName: string) => {
  return createMiddleware<AuthEnv>(async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.role || user.role !== roleName) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403);
    }

    await next();
  });
};

/**
 * Optional auth - doesn't block if no token
 */
export const optionalAuth = createMiddleware<AuthEnv>(async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = await verifyToken(token);
      c.set('user', decoded);
    }
  } catch (error) {
    // Silently fail - user is just not authenticated
    console.log('Optional auth failed, continuing as guest');
  }

  await next();
});