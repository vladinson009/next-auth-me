import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import db from './db/drizzle';
import { users } from './db/usersSchema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { verify } from 'otplib';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error('Incorrect credentials');
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!
          );
          if (!passwordCorrect) {
            throw new Error('Incorrect credentials');
          }
          if (user.twoFactorActivated) {
            const tokenValid = await verify({
              token: credentials.token as string,
              secret: user.twoFactorSecret ?? '',
            });
            if (!tokenValid.valid) {
              throw new Error('Incorrect OTP');
            }
          }
        }
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
