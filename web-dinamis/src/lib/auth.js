import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from './db';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const users = await query('SELECT * FROM users WHERE username = ?', [
          credentials.username,
        ]);

        if (users.length === 0) return null;

        const user = users[0];

        // Support both bcrypt hashed passwords and md5 (legacy)
        let isValid = false;
        if (user.password.startsWith('$2')) {
          isValid = await bcrypt.compare(credentials.password, user.password);
        } else {
          // Legacy md5 — compare with crypto
          const crypto = await import('crypto');
          const md5 = crypto.createHash('md5').update(credentials.password).digest('hex');
          isValid = md5 === user.password;
        }

        if (!isValid) return null;

        return {
          id: user.id_user.toString(),
          username: user.username,
          name: user.nama_lengkap,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
