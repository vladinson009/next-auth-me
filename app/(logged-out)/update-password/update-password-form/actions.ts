'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { passwordResetTokens } from '@/db/passwordResetTokensSchema';
import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validations/passwordMatchSchema';
import { hash } from 'bcryptjs';
import { and, eq, gt } from 'drizzle-orm';

type Props = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export async function updatePassword({ token, password, passwordConfirm }: Props) {
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!passwordValidation.success) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message ?? 'An error occured',
    };
  }

  const session = await auth();

  if (session?.user?.id) {
    return {
      error: true,
      message: 'Already logged in. Please log out to reset your password',
    };
  }
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.tokenExpiry, new Date())
        )
      );

    if (!passwordResetToken) {
      return {
        error: true,
        message: 'Your token is invalid or has expired',
        tokenInvalid: true,
      };
    }

    const hashedPassword = await hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passwordResetToken.userId!));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passwordResetToken.id));
  }
}
