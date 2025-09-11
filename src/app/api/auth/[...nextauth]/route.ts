import NextAuth, { NextAuthOptions, Session, SessionStrategy } from "next-auth"
import { adminAuth } from "@/lib/firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/types";
import { JWT } from "next-auth/jwt";
import { Role } from "@/types/role";
import { getUserByEmail } from "@/services/users";

export const authOptions: NextAuthOptions = {
    debug: true,
    providers: [


        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(
                credentials: Record<"email" | "password", string> | undefined,
                req
            ): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const users = await getUserByEmail(credentials.email);
                const user = users[0];


                if (user && user.password === credentials?.password) {
                    return { id: user.id, username: user.username, email: user.email, role: user.role };
                }
                return null;
            }
        }),
        CredentialsProvider({
            id: "firebase",
            name: "Firebase",
            credentials: { idToken: { label: "ID Token", type: "text" } },
            async authorize(credentials, req): Promise<User | null> {
                try {
                    const decoded = await adminAuth.verifyIdToken(credentials?.idToken || "");
                    const firebaseEmail = decoded.email;
                    const users = await getUserByEmail(firebaseEmail);
                    const existingUser = users[0];
                    if (existingUser) {
                        return {
                            id: existingUser.id,
                            username: existingUser.username,
                            email: existingUser.email,
                            role: existingUser.role,
                        };
                    }
                    else {
                        return null;
                    }

                } catch (err) {
                    console.error("Lỗi xác thực Firebase:", err);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string | number;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
