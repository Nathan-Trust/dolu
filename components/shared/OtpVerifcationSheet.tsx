"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Loader2, XCircle } from "lucide-react";
import { ResponsiveOverlay } from "@/components/shared/ResponsiveOverlay";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  actionName: string;
  onSendOtp: () => Promise<any>;
  onVerifyOtp: (otp: string) => Promise<any>;
  isSendingOtp?: boolean;
  isVerifyingOtp?: boolean;
  errorDialogContent?: React.ReactNode;
  errorDialogTitle?: React.ReactNode;
  errorDialogDescription?: React.ReactNode;
  hideErrorDialogFooter?: boolean;
  errorConfirmButtonText?: string;
  otpDescription?: string;
}

export default function OtpVerificationSheet({
  isOpen,
  onClose,
  onVerified,
  actionName,
  onSendOtp,
  onVerifyOtp,
  isSendingOtp = false,
  isVerifyingOtp = false,
  errorDialogContent,
  errorDialogTitle,
  errorDialogDescription,
  hideErrorDialogFooter,
  otpDescription,
  errorConfirmButtonText = "Close",
}: Readonly<OtpVerificationSheetProps>) {
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const isLoading = isSendingOtp || isVerifyingOtp;

  const handleSendOtp = async () => {
    try {
      await onSendOtp();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP.";
      toast.error(msg);
      setLastErrorMessage(msg);
      setShowErrorDialog(true);
    }
  };

  const onSubmit = async (values: OtpFormValues) => {
    try {
      await onVerifyOtp(values.otp);
      toast.success("OTP verified successfully!");
      onVerified();
      onClose()
      form.reset();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "OTP verification failed. Please try again.";
      toast.error(msg);
      setLastErrorMessage(msg);
      setShowErrorDialog(true);
    }
  };

  const handleClose = () => {
    form.reset();
    setShowErrorDialog(false);
    setLastErrorMessage(null);
    onClose();
  };

  const defaultErrorDialogContent = (
    <div className="flex flex-col items-center p-6 text-center">
      <XCircle className="h-16 w-16 text-red-500 mb-4" />
      <DialogTitle className="text-2xl font-bold mb-2">
        {errorDialogTitle || `${actionName} Failed`}
      </DialogTitle>
      <DialogDescription className="text-gray-8 dark:text-gray-400 mb-6">
        {errorDialogDescription ||
          lastErrorMessage ||
          "An unexpected error occurred. Please try again."}
      </DialogDescription>
      {!hideErrorDialogFooter && (
        <DialogFooter className="flex w-full justify-center">
          <Button
            type="button"
            className="w-full max-w-[200px] mx-auto h-[45px] bg-red-600 hover:bg-red-700 text-white"
            onClick={handleClose}
          >
            {errorConfirmButtonText}
          </Button>
        </DialogFooter>
      )}
    </div>
  );

  return (
    <ResponsiveOverlay isOpen={isOpen} onClose={handleClose}>
      <FormContent
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={handleClose}
        handleSendOtp={handleSendOtp}
        isSendingOtp={isSendingOtp}
        otpDescription={otpDescription}
        defaultErrorDialogContent={
          errorDialogContent || defaultErrorDialogContent
        }
        showErrorDialog={showErrorDialog}
        setShowErrorDialog={setShowErrorDialog}
      />
    </ResponsiveOverlay>
  );
}

function FormContent({
  form,
  onSubmit,
  isLoading,
  onClose,
  handleSendOtp,
  isSendingOtp,
  defaultErrorDialogContent,
  showErrorDialog,
  setShowErrorDialog,
  otpDescription,
}: Readonly<{
  form: ReturnType<typeof useForm<OtpFormValues>>;
  onSubmit: (data: OtpFormValues) => void;
  isLoading: boolean;
  onClose: () => void;
  handleSendOtp: () => void;
  isSendingOtp: boolean;
  defaultErrorDialogContent: React.ReactNode;
  showErrorDialog: boolean;
  setShowErrorDialog: (open: boolean) => void;
  otpDescription?: string;
}>) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-foundationBlue"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">Authentication</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-blood-9"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-[73px]">
            <div className="bg-accent-alpha-3 p-3 rounded-sm">
              <p className="text-sm text-tokens-text">
                {otpDescription ??
                  "Enter the one-time password sent to your email address"}
              </p>
            </div>

            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">OTP Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} disabled={isLoading} {...field}>
                      <InputOTPGroup className="mx-auto space-x-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="border-b border-t-0 border-r-0 border-l-0 text-color-gray-12"
                            classNameActive="border-blue-11 ring-0"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resend OTP */}
            <div className="space-y-1">
              <p className="text-center text-gray-10">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                variant="link"
                className="px-0 w-full text-center mt-0 text-blue-11"
              >
                {isSendingOtp ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t sticky bottom-0 bg-variable_effect-solid">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSendingOtp ? "Sending OTP..." : "Verifying..."}
                </>
              ) : (
                "Proceed"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-[367px] p-0 rounded-[8px] overflow-hidden">
          {defaultErrorDialogContent}
        </DialogContent>
      </Dialog>
    </div>
  );
}
