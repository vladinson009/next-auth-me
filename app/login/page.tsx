'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordSchema } from '@/validations/passwordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { LoginWithCredentials } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    const response = await LoginWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      form.setError('root', {
        message: response.message,
      });
    } else {
      router.push('/my-account');
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                className="flex flex-col gap-2"
                disabled={form.formState.isSubmitting}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!!form.formState.errors.root?.message && (
                  <FormMessage>{form.formState.errors.root.message}</FormMessage>
                )}
                <Button type="submit">Login</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            <span>Don&apos;t have an account? </span>
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            <span>Forgot password? </span>
            <Link href="/password-reset" className="underline">
              Reset my password
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
