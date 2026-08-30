import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-magic-key-for-local-dev-only",
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const creds = credentials as { identifier?: string; email?: string; password?: string } | null;
        const rawIdentifier = creds?.identifier || creds?.email;
        const password = creds?.password;

        if (!rawIdentifier || !password) return null;

        const identifier = rawIdentifier.trim();
        const lowerIdentifier = identifier.toLowerCase();
        const upperIdentifier = identifier.toUpperCase();

        // Support lookup by email OR CandidateProfile SEC ID
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: lowerIdentifier },
              { candidateProfile: { secId: upperIdentifier } },
              { candidateProfile: { secId: identifier } },
            ]
          },
          include: { candidateProfile: true }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
});
