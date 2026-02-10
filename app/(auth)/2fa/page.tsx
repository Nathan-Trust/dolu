"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  twoFactorAuthSchema,
  type TwoFactorAuthFormValues,
} from "@/schema/auth";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function TwoFactorAuthPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TwoFactorAuthFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(twoFactorAuthSchema as any),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: TwoFactorAuthFormValues) => {
    console.log("2FA code:", data);
    // Simulate: first-time user goes to reset-password
    router.push("/reset-password");
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log("Resend code requested");
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setValue("code", value);
  };

  // Masked email for display
  const maskedEmail = "s******y@email.com";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-bold text-[#0f0f0f]">
            Authentication Required
          </p>
          <p className="text-sm text-[#6f6d6d]">
            Enter the code sent to{" "}
            <span className="font-bold">{maskedEmail}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex flex-col gap-6">
          <InputOTP
            maxLength={5}
            value={otp}
            onChange={handleOtpChange}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup className="gap-4">
              <InputOTPSlot
                index={0}
                className="h-10 w-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] text-base"
              />
              <InputOTPSlot
                index={1}
                className="h-10 w-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] text-base"
              />
              <InputOTPSlot
                index={2}
                className="h-10 w-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] text-base"
              />
              <InputOTPSlot
                index={3}
                className="h-10 w-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] text-base"
              />
              <InputOTPSlot
                index={4}
                className="h-10 w-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] text-base"
              />
            </InputOTPGroup>
          </InputOTP>

          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              className="w-31 rounded-lg border-0 bg-[#f2d5ff] px-4 py-2 text-sm font-bold text-[#8a38f5] hover:bg-[#f2d5ff]/80"
            >
              Resend Code
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || otp.length !== 5}
              className="w-31 rounded-lg bg-[#8a38f5] px-4 py-2 text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {isSubmitting ? "Verifying..." : "Proceed"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
