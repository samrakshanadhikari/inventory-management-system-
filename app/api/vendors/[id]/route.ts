import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/vendors/[id] - Get single vendor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        assets: {
          select: {
            id: true,
            tag: true,
            name: true,
            status: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            assets: true
          }
        }
      }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor" },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/[id] - Update vendor
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
    const { name, contactEmail, phone } = body;

    const { id } = await params;
    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id }
    });

    if (!existingVendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // If name is being changed, check if new name already exists
    if (name && name !== existingVendor.name) {
      const nameExists = await prisma.vendor.findUnique({
        where: { name }
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Vendor with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(phone !== undefined && { phone })
      }
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}

// DELETE /api/vendors/[id] - Delete vendor
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

    const { id } = await params;
    // Check if vendor exists and has assets
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        assets: true
      }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    if (vendor.assets.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete vendor that has associated assets" },
        { status: 400 }
      );
    }

    await prisma.vendor.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Vendor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json(
      { error: "Failed to delete vendor" },
      { status: 500 }
    );
  }
}
