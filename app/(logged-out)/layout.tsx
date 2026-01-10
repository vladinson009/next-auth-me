import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function LoggedOutLayout({ children }: PropsWithChildren) {
  const session = await auth();
  console.log(session);

  if (!!session?.user?.id) {
    redirect('/my-account');
  }

  return children;
}
