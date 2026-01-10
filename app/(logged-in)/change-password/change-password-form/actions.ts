'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validations/passwordMatchSchema';
import { passwordSchema } from '@/validations/passwordSchema';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import z from 'zod';

type Props = {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
};

export async function changePassword({
  currentPassword,
  password,
  passwordConfirm,
}: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: 'You must be logged in to change your password',
    };
  }
  const formSchema = z
    .object({
      currentPassword: passwordSchema,
    })
    .and(passwordMatchSchema);

  const passwordValidation = formSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });

  if (passwordValidation.error) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message ?? 'An error occured',
    };
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: 'User not found',
    };
  }
  const passwordMatch = await compare(currentPassword, user.password!);

  if (!passwordMatch) {
    return {
      error: true,
      message: 'Current password is incorrect',
    };
  }
  const hashedPassword = await hash(password, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, parseInt(session.user.id)));
}
