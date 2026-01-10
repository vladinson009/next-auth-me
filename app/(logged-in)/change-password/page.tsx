import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChangePasswordForm from './change-password-form';

export default function ChangePasswordPage() {
  return (
    <Card className="w-87.5">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
