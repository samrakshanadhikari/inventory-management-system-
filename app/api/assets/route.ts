import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

// GET /api/assets - Fetch all assets
export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            contactEmail: true,
            phone: true
          }
        },
        checkouts: {
          where: {
            returnDate: null
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

// POST /api/assets - Create new asset
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
    const { tag, name, status, vendorId } = body;

    // Validate required fields
    if (!tag || !name) {
      return NextResponse.json(
        { error: "Tag and name are required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existingAsset = await prisma.asset.findUnique({
      where: { tag }
    });

    if (existingAsset) {
      return NextResponse.json(
        { error: "Asset with this tag already exists" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        tag,
        name,
        status: status || AssetStatus.AVAILABLE,
        vendorId: vendorId || null
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            contactEmail: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

