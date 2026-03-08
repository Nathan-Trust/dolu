"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import CustomSheet from "@/components/shared/CustomSheetDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ClientService } from "@/services/clients";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const sendSubscriptionSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

type SendSubscriptionFormValues = z.infer<typeof sendSubscriptionSchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SendSubscriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function SendSubscriptionSheet({
  open,
  onOpenChange,
  onSuccess,
}: SendSubscriptionSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendSubscriptionFormValues>({
    resolver: zodResolver(sendSubscriptionSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
    },
  });

  const sendMutation = useMutation({
    mutationFn: (data: SendSubscriptionFormValues) =>
      ClientService.createClient({
        first_name: data.clientName,
        email: data.email,
        phone: data.phone,
      }),
    onSuccess: () => {
      onSuccess?.();
      reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (data: SendSubscriptionFormValues) => {
    sendMutation.mutate(data);
  };

  return (
    <CustomSheet
      title="Add Client"
      description="Send Subscription Form to client"
      active={open}
      setActive={onOpenChange}
      showTrigger={false}
      className="w-full sm:w-3/4 md:w-125 md:min-w-125"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 pb-8 pt-4"
      >
        <FieldGroup>
          {/* ── Client Name ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Client Name
            </FieldLabel>
            <Input
              placeholder="Peter Abbey"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("clientName")}
              aria-invalid={!!errors.clientName}
            />
            {errors.clientName && (
              <FieldError>{errors.clientName.message}</FieldError>
            )}
          </Field>

          {/* ── Email Address ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Email Address
            </FieldLabel>
            <Input
              type="email"
              placeholder="peterabbey@email.com"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          {/* ── Phone Number ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Phone Number
            </FieldLabel>
            <div className="flex gap-2">
              <div className="flex w-27.25 items-center rounded-lg bg-[#f3f3f3] p-4">
                <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
                  +234
                </span>
              </div>
              <Input
                type="tel"
                placeholder="0802 123 1234"
                className="h-12 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          {/* ── Email Preview ── */}
          <div className="mt-2 flex flex-col gap-2">
            <p className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Email Preview
            </p>
            <div className="rounded-lg border border-[#e0e0e0] bg-[#f3f3f3] p-4">
              <div className="flex flex-col gap-3">
                <p className="font-montserrat text-sm text-[#0f0f0f]">
                  <span className="font-bold">Subject</span>: DOLU GLOBAL
                  INTEGRATED SERVICES LTD - SUBSCRIPTION FORM
                </p>
                <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
                  Dear [Client Name],
                </p>
                <p className="font-montserrat text-sm text-[#0f0f0f]">
                  Thank you for patronizing{" "}
                  <span className="font-bold">[Company Name]</span>, we look
                  forward to doing business with you. Kindly{" "}
                  <span className="font-bold text-[#8a38f5] underline">
                    click here to fill the subscription form
                  </span>{" "}
                  to get started.
                </p>
              </div>
            </div>
          </div>

          {/* ── Send Button ── */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={sendMutation.isPending}
              className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {sendMutation.isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
