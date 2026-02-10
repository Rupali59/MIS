import type { Role } from "@/models/User";

declare module "next-auth" {
  interface User {
    role?: Role;
    misId?: number;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role;
      misId?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    misId?: number;
  }
}
