import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AssetsPageClient from "./AssetsPageClient";

interface SessionWithRole {
  user?: {
    email?: string | null;
    name?: string | null;
  };
  role?: string;
}

export default async function AssetsPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch assets with vendor information
  const assets = await prisma.asset.findMany({
    include: {
      vendor: {
        select: {
          name: true
        }
      },
      checkouts: {
        where: {
          returnDate: null
        },
        include: {
          user: {
            select: {
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

  // Fetch vendors for the form
  const vendors = await prisma.vendor.findMany({
    select: {
      id: true,
      name: true
    }
  });

  // Fetch users for checkout form
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  });
                      
                      return (
    <AssetsPageClient
      initialAssets={assets}
      vendors={vendors}
      users={users}
      session={session}
    />
  );
}