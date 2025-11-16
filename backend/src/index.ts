// src/index.ts

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';

const app = new Hono();
const prisma = new PrismaClient();

// ============================================
// MIDDLEWARE
// ============================================

app.use('*', cors({
  origin: [
    
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
}));

app.use('*', logger());

// ============================================
// HEALTH CHECK
// ============================================

app.get('/', (c) => {
  return c.json({
    message: 'Tunisia Real Estate API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return c.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 503);
  }
});

// ============================================
// ROUTES
// ============================================

app.route('/api/auth', authRoutes);
app.route('/api/properties', propertyRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error', message: err.message }, 500);
});

app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================
// START SERVER
// ============================================

const port = parseInt(process.env.PORT || '3000');
console.log(`🚀 Server starting on http://localhost:${port}`);

export { app };
export default {
  port,
  fetch: app.fetch,
};
