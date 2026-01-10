'use server';

import db from '@/db/drizzle';
import { passwordMatchSchema } from '@/validations/passwordMatchSchema';
import z from 'zod';

type Props = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export async function registerUser({ email, password, passwordConfirm }: Props) {
  // const result = await db.select()

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
}
