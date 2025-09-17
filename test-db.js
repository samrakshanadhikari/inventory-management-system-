const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test basic queries
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    const vendorCount = await prisma.vendor.count();
    console.log(`🏢 Vendors in database: ${vendorCount}`);
    
    const assetCount = await prisma.asset.count();
    console.log(`📦 Assets in database: ${assetCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found - database needs setup');
    } else {
      console.log('✅ Database is set up with demo data');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
