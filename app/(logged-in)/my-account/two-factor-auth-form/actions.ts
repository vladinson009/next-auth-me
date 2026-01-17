'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { eq } from 'drizzle-orm';
import { generateSecret, generateURI } from 'otplib';
export async function get2faSecret() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: 'User not found',
    };
  }
  let twoFactorSecret = user.twoFactorSecret;
  if (!twoFactorSecret) {
    twoFactorSecret = generateSecret();
    await db
      .update(users)
      .set({
        twoFactorSecret,
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  const generatedURI = generateURI({
    label: session.user.email!,
    issuer: 'Next Auth Me',
    secret: twoFactorSecret,
  });

  return {
    twoFactorSecret: generatedURI,
  };
}

/**
 * import { generateSecret, generate, verify, generateURI } from "otplib";

// Generate a secret
const secret = generateSecret();

// Generate a TOTP token
const token = await generate({ secret });

// Verify a token
const isValid = await verify({ secret, token });

// Generate QR code URI for authenticator apps
const uri = generateURI({
  issuer: "MyService",
  label: "user@example.com",
  secret,
});
 */
