'use client';

import { Button } from '@/components/ui/button';
import logout from './actions';

export default function LogoutButton() {
  return (
    <Button onClick={async () => await logout()} size="sm">
      Logout
    </Button>
  );
}
