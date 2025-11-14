import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🧪 Testing MySQL database connection...\n');

  try {
    // Test 1: Basic connection
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ MySQL connection successful');

    // Test 2: Check database version
    const version: any[] = await prisma.$queryRaw`SELECT VERSION() as version`;
    console.log('🔧 MySQL version:', version[0].version);

    // Test 3: Show all tables
    const tables: any[] = await prisma.$queryRaw`SHOW TABLES`;
    console.log('📊 Tables in database:', tables.map(t => Object.values(t)[0]));

    // Test 4: Count roles (should have data if seeded)
    const roleCount = await prisma.role.count();
    console.log(`👥 Found ${roleCount} roles`);

    // Show role details
    if (roleCount > 0) {
      const roles = await prisma.role.findMany();
      console.log('📋 Roles:', roles);
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();