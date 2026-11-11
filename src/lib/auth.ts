import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Query user from SQLite database
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        // 2. If user doesn't exist or has no password set
        if (!user || !user.password) {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // 3. Compare password hash securely using bcrypt
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // 4. Return user data for JWT token
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          role: user.role || "Member",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo_google_secret",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "demo_github_id",
      clientSecret: process.env.GITHUB_SECRET || "demo_github_secret",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "Member";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "cloudpulse_super_secret_session_token_key_32chars!",
};
