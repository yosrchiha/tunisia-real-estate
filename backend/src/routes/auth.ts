import { Hono } from 'hono';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { authMiddleware } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const auth = new Hono();

// Add detailed error handler for auth routes
auth.onError((err, c) => {
  console.error('🔥 Auth route global error:', err);
  console.error('🔥 Error stack:', err.stack);
  return c.json({ 
    success: false,
    error: 'Auth route error',
    message: err.message 
  }, 500);
});

auth.post('/register', async (c) => {
  console.log('🔧 Register route called');
  
  try {
    const body = await c.req.json().catch(err => {
      console.error('❌ JSON parse error:', err);
      throw new Error('Invalid JSON in request body');
    });
    
    console.log('📦 Request body:', body);

    // Validate input
    const validatedData = registerSchema.parse(body);
    console.log('✅ Validated data:', validatedData);

    console.log('🔧 Calling registerUser service...');
    const user = await registerUser(
      validatedData.username,
      validatedData.email,
      validatedData.password,
      validatedData.role
    );
    console.log('✅ registerUser completed:', user);

    return c.json(
      {
        success: true,
        message: 'User registered successfully',
        user,
      },
      201
    );

  } catch (error: any) {
    console.error('💥 Registration route CATCH BLOCK:');
    console.error('💥 Error name:', error.name);
    console.error('💥 Full error:', error);
    
    // FIX: Proper Zod error handling
    if (error.name === 'ZodError') {
      console.error('💥 Zod validation errors:', error.errors);
      return c.json(
        { 
          success: false,
          error: 'Validation failed', 
          details: error.errors // Include details to see what's wrong
        },
        400
      );
    }
    
    return c.json(
      { 
        success: false,
        error: error.message || 'Registration failed' 
      },
      400
    );
  }
});

auth.post('/login', async (c) => {
  console.log('🔧 Login route called');
  
  try {
    const body = await c.req.json().catch(err => {
      console.error('❌ JSON parse error:', err);
      throw new Error('Invalid JSON in request body');
    });

    const validatedData = loginSchema.parse(body);
    console.log('✅ Validated login data:', { email: validatedData.email });

    console.log('🔧 Calling loginUser service...');
    const result = await loginUser(validatedData.email, validatedData.password);
    console.log('✅ loginUser completed');

    return c.json({
      success: true,
      message: 'Login successful',
      data: result,
    });

  } catch (error: any) {
    console.error('💥 Login route CATCH BLOCK:');
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    if (error.name === 'ZodError') {
      return c.json(
        { 
          success: false,
          error: 'Validation failed', 
          details: error.errors 
        },
        400
      );
    }
    
    return c.json(
      { 
        success: false,
        error: error.message || 'Login failed' 
      },
      401
    );
  }
});

auth.get('/me', authMiddleware, async (c) => {
  try {
    const user = (c as any).get('user');
    
    if (!user) {
      return c.json(
        { 
          success: false,
          error: 'User not found in context' 
        },
        401
      );
    }

    const fullUser = await getUserById(user.userId);
    return c.json({ 
      success: true,
      user: fullUser 
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ 
      success: false,
      error: 'Failed to get user profile' 
    }, 500);
  }
});
const prisma = new PrismaClient();


// Route protégée pour récupérer le profil de l’utilisateur
auth.get('/profile', authMiddleware, async (c) => {
  try {
    // L'utilisateur est injecté par authMiddleware
    const user = (c as any).get('user');
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const fullUser = await getUserById(user.userId);
    if (!fullUser) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    return c.json({ success: true, user: fullUser });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return c.json({ success: false, error: 'Failed to get user profile' }, 500);
  }
});

auth.post('/logout', (c) => {
  return c.json({ 
    success: true,
    message: 'Logout successful' 
  });
});

export default auth;