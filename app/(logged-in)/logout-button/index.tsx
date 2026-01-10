'use client';

import { Button } from '@/components/ui/button';
import logout from './actions';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        logout();
        router.push('/login');
      }}
      size="sm"
    >
      Logout
    </Button>
  );
}
