import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface UserWithRole {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

interface TokenWithRole {
  role?: string;
}

interface SessionWithRole {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Dev Email",
      credentials: {
        email: { label: "Email", type: "text" },
        role: { label: "Role", type: "text" }
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().toLowerCase();
        const roleInput = (creds?.role || "").toUpperCase();
        
        // Demo account mappings for easy login
        const demoAccounts: Record<string, { email: string; role: string }> = {
          "admin": { email: "admin@example.com", role: "ADMIN" },
          "admin@example.com": { email: "admin@example.com", role: "ADMIN" },
          "staff": { email: "staff1@example.com", role: "STAFF" },
          "staff1": { email: "staff1@example.com", role: "STAFF" },
          "staff1@example.com": { email: "staff1@example.com", role: "STAFF" },
          "staff2": { email: "staff2@example.com", role: "STAFF" },
          "staff2@example.com": { email: "staff2@example.com", role: "STAFF" }
        };
        
        // Check if it's a demo account
        const demoAccount = demoAccounts[email];
        if (demoAccount) {
          const user = await prisma.user.findUnique({ where: { email: demoAccount.email } });
          if (user && (!roleInput || roleInput === demoAccount.role)) {
            return { id: user.id, email: user.email, name: user.name, role: user.role };
          }
        }
        
        // Try to find user by exact email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (roleInput && roleInput !== user.role) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { 
      if (user) {
        (token as TokenWithRole).role = (user as UserWithRole).role;
      }
      return token; 
    },
    async session({ session, token }) { 
      (session as SessionWithRole).role = (token as TokenWithRole).role; 
      return session; 
    },
  },
  pages: { signIn: "/auth/signin" },
};
