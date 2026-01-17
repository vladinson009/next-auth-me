'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { get2faSecret } from './actions';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

type Props = {
  twoFactorActivated: boolean;
};

export default function TwoFactorAuthForm({ twoFactorActivated }: Props) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  async function handleEnableClick() {
    const response = await get2faSecret();

    if (response.error) {
      toast.error(response.message);
      return;
    }
    setStep(2);
    setCode(response.twoFactorSecret ?? '');
  }

  async function handleOTPSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div>
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs text-muted-foreground py-2">
                Scan the QR code below in the Google Authenticator app to activate
                Two-Factor Authentication.
              </p>
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)} className="w-full my-2">
                I have scanned the QR code
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full my-2"
              >
                Cancel
              </Button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Please enter the one-time passcode from the Google Authenticator app.
              </p>
              <InputOTP maxLength={6}>
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
              <Button type="submit">Submit and activate</Button>
              <Button onClick={() => setStep(2)} variant="outline">
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
