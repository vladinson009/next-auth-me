import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default async function MyAccount() {
  const session = await auth();

  return (
    <Card className="w-87.5">
      <CardHeader>
        <CardTitle>My account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
      </CardContent>
    </Card>
  );
}
