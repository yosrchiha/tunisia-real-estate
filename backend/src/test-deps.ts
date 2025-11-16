import { app } from './index';

async function testAuth() {
  console.log('🧪 Testing Authentication System\n');

  // Use shorter unique test data that fits validation
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits only
  const testUser = {
    username: `test_${timestamp}`, // Shorter username
    email: `test_${timestamp}@example.com`,
    password: 'password123',
    role: 'buyer' as const
  };

  console.log('📝 Test user data:', testUser);

  // Test registration
  try {
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json() as any;
    console.log('Register Status:', registerResponse.status);
    console.log('Register Data:', registerData);

    if (registerData.success) {
      console.log('✅ Registration successful!');
      
      // Only test login if registration was successful
      console.log('\n2️⃣ Testing Login...');
      const loginResponse = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      const loginData = await loginResponse.json() as any;
      console.log('Login Status:', loginResponse.status);
      console.log('Login Data:', loginData);

      if (loginData.success) {
        console.log('✅ Login successful!');
        console.log('🔑 Token received:', loginData.data?.token ? 'Yes' : 'No');
        
        // Test protected route with the token
        if (loginData.data?.token) {
          console.log('\n3️⃣ Testing Protected Route...');
          const meResponse = await app.request('/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginData.data.token}`
            }
          });
          
          const meData = await meResponse.json() as any;
          console.log('Protected Route Status:', meResponse.status);
          console.log('Protected Route Data:', meData);
          
          if (meData.success) {
            console.log('✅ Protected route access successful!');
          } else {
            console.log('⚠️ Protected route failed:', meData.error);
          }
        }
      } else {
        console.log('⚠️ Login failed:', loginData.error || loginData.message);
      }
    } else {
      console.log('⚠️ Registration failed:', registerData.error || registerData.message);
      if (registerData.details) {
        console.log('Validation details:', registerData.details);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('\n🎉 All authentication tests completed!');
}

testAuth();