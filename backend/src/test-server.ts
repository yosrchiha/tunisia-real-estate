// Import the app directly from the file, not the default export
import { app } from './index';

async function testServer() {
  console.log('🧪 Testing Server Basics...\n');

  // Test 1: Root endpoint
  try {
    const req = new Request('http://localhost:3000/');
    const res = await app.request(req);
    const data = await res.json();
    console.log('✅ Root endpoint:', data);
  } catch (error) {
    console.error('❌ Root endpoint failed:', error);
  }

  // Test 2: Health endpoint
  try {
    const req = new Request('http://localhost:3000/health');
    const res = await app.request(req);
    const data = await res.json();
    console.log('✅ Health endpoint:', data);
  } catch (error) {
    console.error('❌ Health endpoint failed:', error);
  }

  // Test 3: Non-existent route
  try {
    const req = new Request('http://localhost:3000/nonexistent');
    const res = await app.request(req);
    const data = await res.json();
    console.log('✅ 404 handling:', data);
  } catch (error) {
    console.error('❌ 404 handling failed:', error);
  }
}

testServer();