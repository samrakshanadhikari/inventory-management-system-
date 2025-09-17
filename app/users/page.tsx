import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersPageClient from "./UsersPageClient";

interface SessionWithRole {
  user?: {
    email?: string | null;
    name?: string | null;
  };
  role?: string;
  expires: string;
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch users with checkout counts
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          checkouts: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === "ADMIN").length;
  const staffUsers = users.filter(u => u.role === "STAFF").length;
  const activeUsers = users.filter(u => u._count.checkouts > 0).length;

  return (
    <UsersPageClient 
      users={users}
      session={session}
    />
  );
}

