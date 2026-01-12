import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/drizzle';
import { passwordResetTokens } from '@/db/passwordResetTokensSchema';
import { and, eq, gt } from 'drizzle-orm';
import Link from 'next/link';
import UpdatePasswordForm from './update-password-form';

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function UpdatePassword({ searchParams }: Props) {
  let tokenIsValid = false;

  const { token } = await searchParams;

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

    if (passwordResetToken) {
      tokenIsValid = true;
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? 'Update password'
              : 'Your password reset link is invalid or has expired'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <UpdatePasswordForm token={token ?? ''} />
          ) : (
            <Link className="underline" href="/password-reset">
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
