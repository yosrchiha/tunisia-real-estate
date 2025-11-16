// backend/src/test-auth-simple-debug.ts
const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Auth Routes with Detailed Debug...\n');

  const timestamp = Date.now();
  const testUser = {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: 'password123',
    role: 'buyer'
  };

  console.log('📝 Test payload:', JSON.stringify(testUser, null, 2));

  // Test 1: Register with detailed debugging
  console.log('\n1️⃣ Testing registration with debug...');
  try {
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testUser),
    });

    console.log('📊 Response status:', registerResponse.status);
    console.log('📊 Response OK:', registerResponse.ok);
    
    const responseText = await registerResponse.text();
    console.log('📊 Raw response:', responseText);
    
    let registerData;
    try {
      registerData = JSON.parse(responseText);
      console.log('✅ Parsed JSON:', registerData);
    } catch (e) {
      console.log('❌ Failed to parse JSON:', e);
      return;
    }

    if (!registerData.success) {
      console.log('🔍 Validation error details:', registerData);
    }

  } catch (error) {
    console.log('💥 Fetch error:', error);
  }

  console.log('\n🎉 Debug test completed!');
}

testAuth();