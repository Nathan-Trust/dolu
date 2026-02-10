"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  firstTimeResetPasswordSchema,
  type FirstTimeResetPasswordFormValues,
} from "@/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstTimeResetPasswordFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(firstTimeResetPasswordSchema as any),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FirstTimeResetPasswordFormValues) => {
    console.log("Reset password data:", data);
    // Simulate: navigate to role-confirmation (default: chairman)
    router.push("/role-confirmation/chairman");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-8">
        {/* Welcome message */}
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-bold text-[#0f0f0f]">
            Welcome Sim Tommy,
          </p>
          <p className="text-sm text-[#6f6d6d]">
            Reset your Password to Continue
          </p>
        </div>

        <FieldGroup>
          {/* Current Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Input the password assigned to you by Admin
            </FieldDescription>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="*************"
                className="h-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] px-4 pr-10 text-base"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#0f0f0f]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          {/* New Password */}
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <FieldDescription>Input Password of your choice</FieldDescription>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="*************"
                className="h-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] px-4 pr-10 text-base"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#0f0f0f]"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <FieldError>{errors.newPassword.message}</FieldError>
            )}
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="*************"
                className="h-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] px-4 pr-10 text-base"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#0f0f0f]"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-31 rounded-lg bg-[#8a38f5] px-4 py-2 text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
          >
            {isSubmitting ? "Processing..." : "Proceed"}
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
}
