'use server';

import { passwordMatchSchema } from '@/validations/passwordMatchSchema';
import z from 'zod';
import { hash } from 'bcryptjs';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';

type Props = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export async function registerUser({ email, password, passwordConfirm }: Props) {
  try {
    const newUserSchema = z
      .object({
        email: z.email(),
      })
      .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message: newUserValidation.error.issues[0].message ?? 'An error occured',
      };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email: email,
      password: hashedPassword,
    });
  } catch (error: unknown) {
    const dbError = error as {
      cause?: {
        code?: string;
        constraint?: string;
      };
    };

    if (
      dbError.cause?.code == '23505' &&
      dbError.cause?.constraint === 'users_email_unique'
    ) {
      return {
        error: true,
        message: 'Email is already in use',
      };
    }
    return {
      error: true,
      message: 'An error occured1',
    };
  }
}
