'use server';

import { signIn } from '@/auth';
import { passwordSchema } from '@/validations/passwordSchema';
import z from 'zod';

type Props = {
  email: string;
  password: string;
};
export async function LoginWithCredentials({ email, password }: Props) {
  const loginSchema = z.object({
    email: z.email(),
    password: passwordSchema,
  });
  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0].message ?? 'An error occured',
    };
  }
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    return {
      error: true,
      message: 'Incorrect email or password',
    };
  }
}
