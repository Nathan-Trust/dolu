/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { signInSchema, type SignInFormValues } from "@/schema/auth";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth";
import { useStore } from "@/store/user-store";
import { errorToast } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signInSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const saveUserToken = useStore((s) => s.saveUserToken);
  const saveUserData = useStore((s) => s.saveUserData);

  const mutation = useMutation({
    mutationFn: (payload: SignInFormValues) => AuthService.login(payload),
    onSuccess: async (res) => {
      console.log("res", res);
      const token = res?.data?.token;
      if (token) {
        saveUserToken(token);
      }

      try {
        const meRes = await AuthService.me();
        if (meRes?.data) {
          saveUserData(meRes.data as any);
          const rawRole = (
            meRes.data.role as string | undefined
          )?.toLowerCase();
          const role = rawRole === "superadmin" ? "admin" : rawRole;
          if (role) {
            router.push(`/dashboard/${role}/overview`);
            return;
          }
        }
        // router.push("/dashboard");
      } catch (error) {
        errorToast({
          title: "Sign in",
          message: "Signed in but failed to fetch profile",
        });
        // router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Sign in failed";
      errorToast({ title: "Sign in", message });
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="simtommy@email.com"
            className="h-10 rounded-lg border-[#c8c8c8] bg-[#f8f8f8] px-4 text-base"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

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

        <Button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-31 rounded-lg bg-[#8a38f5] px-4 py-2 text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
        >
          {isSubmitting || mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
