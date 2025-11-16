// backend/src/test-service-direct.ts
import { registerUser, loginUser } from './services/authService';

async function testServiceDirectly() {
  console.log('🧪 Testing Auth Service Directly (No Routes)...\n');

  // Use unique credentials to avoid "user already exists" error
  const timestamp = Date.now();
  const testUser = {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: 'password123',
    role: 'buyer'
  };

  console.log('📝 Test user data:', testUser);

  // Test 1: Register
  console.log('\n1️⃣ Testing registerUser directly...');
  try {
    const user = await registerUser(testUser.username, testUser.email, testUser.password, testUser.role);
    console.log('✅ registerUser success:', user);
  } catch (error) {
    console.log('❌ registerUser failed:');
    console.log('Error:', error instanceof Error ? error.message : error);
  }

  // Test 2: Login
  console.log('\n2️⃣ Testing loginUser directly...');
  try {
    const result = await loginUser(testUser.email, testUser.password);
    console.log('✅ loginUser success:', {
      token: result.token ? 'Received' : 'Missing',
      user: result.user
    });
  } catch (error) {
    console.log('❌ loginUser failed:');
    console.log('Error:', error instanceof Error ? error.message : error);
  }

  console.log('\n🎉 Service tests completed!');
}

testServiceDirectly().catch(console.error);