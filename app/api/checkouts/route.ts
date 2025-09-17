import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

// GET /api/checkouts - Fetch all checkouts
export async function GET() {
  try {
    const checkouts = await prisma.checkout.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        asset: {
          select: {
            id: true,
            tag: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        checkoutDate: "desc"
      }
    });

    return NextResponse.json(checkouts);
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkouts" },
      { status: 500 }
    );
  }
}

// POST /api/checkouts - Create new checkout
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
    const { assetId, userId, dueDate } = body;

    // Validate required fields
    if (!assetId || !userId) {
      return NextResponse.json(
        { error: "Asset ID and User ID are required" },
        { status: 400 }
      );
    }

    // Check if asset exists and is available
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        checkouts: {
          where: {
            returnDate: null
          }
        }
      }
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      return NextResponse.json(
        { error: "Asset is not available for checkout" },
        { status: 400 }
      );
    }

    if (asset.checkouts.length > 0) {
      return NextResponse.json(
        { error: "Asset is already checked out" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create checkout
    const checkout = await prisma.checkout.create({
      data: {
        assetId,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        asset: {
          select: {
            id: true,
            tag: true,
            name: true,
            status: true
          }
        }
      }
    });

    // Update asset status
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.CHECKED_OUT }
    });

    return NextResponse.json(checkout, { status: 201 });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}

