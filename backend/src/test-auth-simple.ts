import { Hono } from 'hono';
import { cors } from 'hono/cors';


const API_BASE = 'http://localhost:3000/api'; 
// In your test-auth-simple.ts
const timestamp = Date.now();
const testUser = {
  username: `testuser_${timestamp}`,
  email: `test_${timestamp}@example.com`,
  password: 'password123'
};

// Use these unique credentials instead of fixed ones
// Test login with the existing user
console.log('\n2️⃣ Testing auth login endpoint...');
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test2@example.com',
    password: 'password123'
  }),
});

const loginData = await loginResponse.json();
console.log('✅ Auth login test:', loginData);
// Create a minimal test app
const testApp = new Hono();
testApp.use('*', cors());

// Test route - always returns JSON
testApp.post('/test-json', (c) => {
  return c.json({ 
    success: true, 
    message: 'Test route works',
    timestamp: new Date().toISOString()
  });
});

// Import and test your auth routes
import authRoutes from './routes/auth';
testApp.route('/api/auth', authRoutes);

async function testAuth() {
  console.log('🧪 Testing Auth Routes Step by Step...\n');

  // Test 1: Simple JSON endpoint
  try {
    console.log('1️⃣ Testing simple JSON endpoint...');
    const req = new Request('http://localhost:3000/test-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await testApp.request(req);
    const data = await res.json();
    console.log('✅ Simple JSON test:', data);
  } catch (error) {
    console.error('❌ Simple JSON test failed:', error);
  }

  // Test 2: Auth register endpoint
  try {
    console.log('\n2️⃣ Testing auth register endpoint...');
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
      })
    });
    
    const res = await testApp.request(req);
    console.log('📊 Response status:', res.status);
    console.log('📊 Response headers:', Object.fromEntries(res.headers));
    
    // Try to get response as text first to see what's returned
    const text = await res.text();
    console.log('📊 Response text:', text);
    
    // Then try to parse as JSON
    if (text) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Auth register test - JSON:', data);
      } catch (parseError) {
        console.log('⚠️ Auth register returned non-JSON:', text);
      }
    }
    
  } catch (error) {
    console.error('❌ Auth register test failed:', error);
  }
}

testAuth();