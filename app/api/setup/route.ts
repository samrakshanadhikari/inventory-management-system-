import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    
    const userCount = await prisma.user.count();
    const vendorCount = await prisma.vendor.count();
    const assetCount = await prisma.asset.count();
    
    return NextResponse.json({
      status: 'ok',
      databaseConnected: true,
      users: userCount,
      vendors: vendorCount,
      assets: assetCount,
      needsSetup: userCount === 0
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check database status',
        details: error instanceof Error ? error.message : 'Unknown error',
        databaseConnected: false
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    // Test database connection first
    await prisma.$connect();
    
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already set up', 
        users: existingUsers,
        status: 'already_setup'
      });
    }

    // Create demo users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin',
          role: 'ADMIN'
        }
      }),
      prisma.user.create({
        data: {
          email: 'staff1@example.com',
          name: 'Staff One',
          role: 'STAFF'
        }
      }),
      prisma.user.create({
        data: {
          email: 'staff2@example.com',
          name: 'Staff Two',
          role: 'STAFF'
        }
      })
    ]);

    // Create demo vendors
    const vendors = await Promise.all([
      prisma.vendor.create({
        data: {
          name: 'Dell Technologies',
          contactEmail: 'sales@dell.com',
          phone: '+1-800-999-3355'
        }
      }),
      prisma.vendor.create({
        data: {
          name: 'HP Inc.',
          contactEmail: 'support@hp.com',
          phone: '+1-800-474-6836'
        }
      }),
      prisma.vendor.create({
        data: {
          name: 'Apple Inc.',
          contactEmail: 'business@apple.com',
          phone: '+1-800-275-2273'
        }
      })
    ]);

    // Create demo assets
    const assets = await Promise.all([
      prisma.asset.create({
        data: {
          tag: 'LT-001',
          name: 'Dell Latitude 5440',
          status: 'AVAILABLE',
          vendorId: vendors[0].id
        }
      }),
      prisma.asset.create({
        data: {
          tag: 'LT-002',
          name: 'HP EliteBook 850',
          status: 'AVAILABLE',
          vendorId: vendors[1].id
        }
      }),
      prisma.asset.create({
        data: {
          tag: 'MB-001',
          name: 'MacBook Pro 14"',
          status: 'CHECKED_OUT',
          vendorId: vendors[2].id
        }
      })
    ]);

    return NextResponse.json({ 
      message: 'Database set up successfully',
      users: users.length,
      vendors: vendors.length,
      assets: assets.length,
      status: 'success',
      demoCredentials: {
        admin: 'admin@example.com or "admin"',
        staff: 'staff1@example.com or "staff"'
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to set up database',
        details: error instanceof Error ? error.message : 'Unknown error',
        databaseConnected: false
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
