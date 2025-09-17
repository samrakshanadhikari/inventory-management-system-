import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/vendors - Fetch all vendors
export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: {
          select: {
            assets: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

// POST /api/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, contactEmail, phone } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Vendor name is required" },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { name }
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: "Vendor with this name already exists" },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        contactEmail: contactEmail || null,
        phone: phone || null
      }
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}

