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
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { LoginWithCredentials, preLoginCheck } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const email = useWatch({ control: form.control, name: 'email' });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    const preLoginCheckResponse = await preLoginCheck({
      email: data.email,
      password: data.password,
    });

    if (preLoginCheckResponse.error) {
      form.setError('root', {
        message: preLoginCheckResponse.message,
      });
      return;
    }

    if (preLoginCheckResponse.twoFactorActivated) {
      setStep(2);
    } else {
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
  }

  async function handleOTPSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await LoginWithCredentials({
      email: form.getValues('email'),
      password: form.getValues('password'),
      token: otp,
    });
    if (response?.error) {
      toast.error(response.message);
    } else {
      router.push('/my-account');
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      {step === 1 && (
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
              <Link
                href={`/password-reset${
                  email ? `?email=${encodeURIComponent(email)}` : ''
                }`}
                className="underline"
              >
                Reset my password
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
      {step === 2 && (
        <Card className="w-87.5">
          <CardHeader>
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription>
              Enter the one-time passcode for Next Auth Me displayed in your Google
              Authenticator app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit">
                Verify OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
