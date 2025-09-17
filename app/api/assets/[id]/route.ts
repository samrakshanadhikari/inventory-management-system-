import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import { AssetStatus } from "@prisma/client";

// GET /api/assets/[id] - Get single asset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findUnique({
      where: { id },
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            checkoutDate: "desc"
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

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    );
  }
}

// PUT /api/assets/[id] - Update asset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // If tag is being changed, check if new tag already exists
    if (tag && tag !== existingAsset.tag) {
      const tagExists = await prisma.asset.findUnique({
        where: { tag }
      });

      if (tagExists) {
        return NextResponse.json(
          { error: "Asset with this tag already exists" },
          { status: 400 }
        );
      }
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        ...(tag && { tag }),
        ...(name && { name }),
        ...(status && { status }),
        ...(vendorId !== undefined && { vendorId })
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

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}

// DELETE /api/assets/[id] - Delete asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if asset exists
    const { id } = await params;
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
      include: {
        checkouts: {
          where: {
            returnDate: null
          }
        }
      }
    });

    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // Check if asset is currently checked out
    if (existingAsset.checkouts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete asset that is currently checked out" },
        { status: 400 }
      );
    }

    await prisma.asset.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Asset deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
