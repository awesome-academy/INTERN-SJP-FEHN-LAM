import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string | number
        username: string
        email: string
        role: string
    }
}

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string | number;
        role: string;
        username: string;
    }

    interface Session {
        user?: {
            id: string | number
            username: string
            email: string
            role: string
        } & DefaultSession["user"];
    }
}
