import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import StudentProfile from "@/models/StudentProfile";
import FacultyProfile from "@/models/FacultyProfile";
import AdminProfile from "@/models/AdminProfile";
import type { Role } from "@/models/User";

function getRoleFromMisId(misId: number): Role {
  if (misId >= 2000 && misId < 8000) return "student";
  if (misId >= 8000 && misId < 12000) return "faculty";
  return "admin";
}

async function getName(misId: number, role: Role): Promise<string> {
  await connectDB();
  if (role === "student") {
    const p = await StudentProfile.findOne({ misId }).lean();
    return p ? `${p.fname || ""} ${p.lname || ""}`.trim() : String(misId);
  }
  if (role === "faculty") {
    const p = await FacultyProfile.findOne({ f_id: misId }).lean();
    return p ? `${p.fname || ""} ${p.lname || ""}`.trim() : String(misId);
  }
  const p = await AdminProfile.findOne({ id: misId }).lean();
  return p ? `${p.fname || ""} ${p.lname || ""}`.trim() : String(misId);
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        misId: { label: "MIS ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.misId || !credentials?.password) return null;
        const misId = parseInt(credentials.misId, 10);
        if (Number.isNaN(misId)) return null;
        await connectDB();
        const user = await User.findOne({ misId }).lean();
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        const role = (user.role as Role) || getRoleFromMisId(misId);
        const name = await getName(misId, role);
        return {
          id: String(misId),
          email: null,
          name,
          role,
          misId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.misId = (user as { misId?: number }).misId;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: Role }).role = token.role as Role;
        (session.user as { misId?: number }).misId = token.misId as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 60 },
});

export { handler as GET, handler as POST };
