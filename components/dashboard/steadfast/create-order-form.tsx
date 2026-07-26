"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus } from "lucide-react";
import { toast } from "sonner";

import {
  createSteadfastOrderSchema,
  type CreateSteadfastOrderInput,
} from "@/lib/schemas";
import { useCreateSteadfastOrder } from "@/hooks/use-steadfast";
import { getErrorMessage } from "@/lib/api-error";
import type { SteadfastOrderResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowButton } from "@/components/forms/glow-button";

const fieldLabel = "mb-1.5 block text-xs font-semibold text-[#4B2E2B]";
const fieldInput =
  "h-auto rounded-xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-2.5 text-sm text-[#4B2E2B] shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-4 focus-visible:ring-[#6B4A3D]/5";

export function CreateOrderForm() {
  const [result, setResult] = useState<SteadfastOrderResponse | null>(null);
  const createOrder = useCreateSteadfastOrder();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSteadfastOrderInput>({
    resolver: zodResolver(createSteadfastOrderSchema),
    defaultValues: {
      invoice: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      cod_amount: 0,
      alternative_phone: "",
      recipient_email: "",
      note: "",
      item_description: "",
      delivery_type: 0,
    },
  });

  const deliveryType = watch("delivery_type");

  const onSubmit = (values: CreateSteadfastOrderInput) => {
    setResult(null);
    createOrder.mutate(values, {
      onSuccess: (data) => {
        toast.success("Order created with Steadfast");
        setResult(data);
        reset();
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Failed to create order")),
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#F9F1E7] opacity-50" />

      <div className="relative z-10 mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
          <PackagePlus className="h-5 w-5 text-[#300332]" />
        </div>
        <h2 className="text-lg font-bold text-[#2D1B14]">Create Courier Order</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div>
          <label className={fieldLabel}>Invoice *</label>
          <Input
            {...register("invoice")}
            placeholder="e.g. INV1001"
            className={fieldInput}
          />
          {errors.invoice && (
            <p className="mt-1 text-xs text-red-500">{errors.invoice.message}</p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>Delivery Type</label>
          <Select
            value={String(deliveryType)}
            onValueChange={(v) =>
              setValue("delivery_type", Number(v) as 0 | 1, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className={`w-full ${fieldInput}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Home Delivery</SelectItem>
              <SelectItem value="1">Hub Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className={fieldLabel}>Recipient Name *</label>
          <Input
            {...register("recipient_name")}
            placeholder="John Doe"
            className={fieldInput}
          />
          {errors.recipient_name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.recipient_name.message}
            </p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>Recipient Phone *</label>
          <Input
            {...register("recipient_phone")}
            placeholder="01XXXXXXXXX"
            className={fieldInput}
          />
          {errors.recipient_phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.recipient_phone.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={fieldLabel}>Recipient Address *</label>
          <Textarea
            {...register("recipient_address")}
            placeholder="House, Road, Area, District"
            rows={2}
            className={fieldInput}
          />
          {errors.recipient_address && (
            <p className="mt-1 text-xs text-red-500">
              {errors.recipient_address.message}
            </p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>COD Amount *</label>
          <Input
            type="number"
            step="0.01"
            {...register("cod_amount")}
            placeholder="0"
            className={fieldInput}
          />
          {errors.cod_amount && (
            <p className="mt-1 text-xs text-red-500">
              {errors.cod_amount.message}
            </p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>Alternative Phone</label>
          <Input
            {...register("alternative_phone")}
            placeholder="Optional"
            className={fieldInput}
          />
          {errors.alternative_phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.alternative_phone.message}
            </p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>Recipient Email</label>
          <Input
            {...register("recipient_email")}
            placeholder="Optional"
            className={fieldInput}
          />
          {errors.recipient_email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.recipient_email.message}
            </p>
          )}
        </div>

        <div>
          <label className={fieldLabel}>Item Description</label>
          <Input
            {...register("item_description")}
            placeholder="Optional"
            className={fieldInput}
          />
        </div>

        <div className="md:col-span-2">
          <label className={fieldLabel}>Note</label>
          <Textarea
            {...register("note")}
            placeholder="Optional delivery note"
            rows={2}
            className={fieldInput}
          />
        </div>

        <div className="md:col-span-2">
          <GlowButton
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#4B2E2B] py-3.5 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#4B2E2B]/20 transition-all hover:bg-[#321E1B]"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </GlowButton>
        </div>
      </form>

      {result && (
        <div className="relative z-10 mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
            Order Created
          </p>
          <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-emerald-800 sm:grid-cols-3">
            <p>
              <span className="font-semibold">Consignment ID:</span>{" "}
              {result.consignment_id}
            </p>
            <p>
              <span className="font-semibold">Tracking Code:</span>{" "}
              {result.tracking_code}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {result.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
