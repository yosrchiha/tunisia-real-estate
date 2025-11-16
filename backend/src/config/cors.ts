export const corsConfig = {
  origin: (origin: string) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:80',
      // Add production URLs later
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return true;
    
    return allowedOrigins.includes(origin);
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
};