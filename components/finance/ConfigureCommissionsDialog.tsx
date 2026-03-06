"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  configureCommissionsSchema,
  type ConfigureCommissionsFormValues,
} from "@/schema/finance";
import { FinanceService } from "@/services/finance";
import { QueryKeys } from "@/models/query";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import { errorToast, successToast } from "@/util/toast";
import CustomDialog from "@/components/shared/CustomDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ConfigureCommissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ConfigureCommissionsDialog({
  open,
  onOpenChange,
}: ConfigureCommissionsDialogProps) {
  /* Fetch existing commission rates */
  const { data: commissionRatesData } = useQuery({
    queryKey: [QueryKeys.Get_Commission_Rates],
    queryFn: () => FinanceService.getCommissionRates(),
    enabled: open,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfigureCommissionsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(configureCommissionsSchema as any),
    defaultValues: {
      rates: [
        { role: "Staff", rate: "5" },
        { role: "Realtor", rate: "5" },
        { role: "Manager", rate: "3" },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "rates",
  });

  /* Update form when data loads */
  useEffect(() => {
    if (commissionRatesData?.data) {
      reset({
        rates: commissionRatesData.data.map((rate) => ({
          role: rate.role,
          rate: rate.rate.toString(),
        })),
      });
    }
  }, [commissionRatesData, reset]);

  /* Query invalidation */
  const { invalidateQuery } = useInvalidateQueries();

  /* Mutation: update commission rates */
  const updateRatesMutation = useMutation({
    mutationFn: (payload: { rates: Array<{ role: string; rate: number }> }) =>
      FinanceService.updateCommissionRates(payload),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_Commission_Rates]);
    },
  });

  /* Submit */
  const onSubmit = (data: ConfigureCommissionsFormValues) => {
    updateRatesMutation.mutate(
      {
        rates: data.rates.map((r) => ({
          role: r.role,
          rate: parseFloat(r.rate),
        })),
      },
      {
        onSuccess: () => {
          successToast({
            title: "Commission Rates",
            message: "Commission rates updated successfully",
          });
          onOpenChange(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          errorToast({
            title: "Commission Rates",
            message:
              error?.response?.data?.message ||
              "Failed to update commission rates",
          });
        },
      },
    );
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="max-w-[480px] rounded-2xl bg-white p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Configure Commission Rates
          </h2>
          <p className="font-montserrat text-xs text-[#6f6d6d]">
            Set commission percentages for each role
          </p>
        </div>

        {/* Commission rates form */}
        <FieldGroup>
          {fields.map((field, index) => (
            <Field key={field.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <FieldLabel className="font-montserrat text-sm font-semibold text-[#0f0f0f]">
                    {field.role}
                  </FieldLabel>
                  <span className="font-montserrat text-xs text-[#6f6d6d]">
                    Commission on sales
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    {...control.register(`rates.${index}.rate`)}
                    className="h-10 w-20 rounded-lg border-0 bg-[#f3f3f3] px-3 font-montserrat text-sm font-bold text-[#0f0f0f]"
                  />
                  <span className="font-montserrat text-sm font-semibold text-[#0f0f0f]">
                    %
                  </span>
                </div>
              </div>
              {errors.rates?.[index]?.rate && (
                <FieldError>{errors.rates[index]?.rate?.message}</FieldError>
              )}
            </Field>
          ))}
        </FieldGroup>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-[#f2d5ff] px-6 py-2 font-montserrat text-sm font-semibold text-[#8a38f5] hover:bg-[#e8c0ff]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateRatesMutation.isPending}
            className="rounded-lg bg-[#8a38f5] px-6 py-2 font-montserrat text-sm font-semibold text-white hover:bg-[#7a2de0]"
          >
            {updateRatesMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
