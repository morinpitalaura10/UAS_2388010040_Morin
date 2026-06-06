import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query } from "./db";

const isBcryptHash = (hash: string) => /^\$2[aby]\$/.test(hash);
const isMd5Hash = (hash: string) => /^[a-f0-9]{32}$/.test(hash);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const rows = await query<any>(
            "SELECT id_user as id, username, password, role FROM users WHERE username = ?",
            [credentials.username]
          );

          const user = rows[0];

          if (user) {
            const md5Password = crypto.createHash("md5").update(credentials.password).digest("hex");
            let isPasswordValid = false;

            if (isBcryptHash(user.password)) {
              isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            } else if (isMd5Hash(user.password)) {
              isPasswordValid = md5Password === user.password;
            }

            if (isPasswordValid) {
              if (isMd5Hash(user.password)) {
                const newHash = await bcrypt.hash(credentials.password, 10);
                await query("UPDATE users SET password = ? WHERE id_user = ?", [newHash, user.id]);
              }

              return {
                id: user.id.toString(),
                name: user.username,
                role: user.role,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-super-secret-key-1234",
};
