import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

// POST /api/checkouts/[id]/return - Return a checked out asset
export async function POST(
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
    // Find the checkout
    const checkout = await prisma.checkout.findUnique({
      where: { id },
      include: {
        asset: true
      }
    });

    if (!checkout) {
      return NextResponse.json(
        { error: "Checkout not found" },
        { status: 404 }
      );
    }

    if (checkout.returnDate) {
      return NextResponse.json(
        { error: "Asset has already been returned" },
        { status: 400 }
      );
    }

    // Update checkout with return date
    const updatedCheckout = await prisma.checkout.update({
      where: { id },
      data: {
        returnDate: new Date()
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

    // Update asset status to available
    await prisma.asset.update({
      where: { id: checkout.assetId },
      data: { status: AssetStatus.AVAILABLE }
    });

    return NextResponse.json(updatedCheckout);
  } catch (error) {
    console.error("Error returning asset:", error);
    return NextResponse.json(
      { error: "Failed to return asset" },
      { status: 500 }
    );
  }
}
