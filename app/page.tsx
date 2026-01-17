import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LogoutButton from './(logged-in)/logout-button';

export default async function Home() {
  const session = await auth();

  const isUser = session?.user?.id;

  return (
    <div className="flex gap-2 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {!isUser && (
        <>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>{' '}
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </>
      )}
      {!!isUser && (
        <>
          <Button asChild>
            <Link href="/my-account">My account</Link>
          </Button>
          <LogoutButton />
        </>
      )}
    </div>
  );
}
