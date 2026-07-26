"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  createSteadfastBulkOrderSchema,
  type CreateSteadfastBulkOrderInput,
} from "@/lib/schemas";
import { useCreateSteadfastBulkOrder } from "@/hooks/use-steadfast";
import { getErrorMessage } from "@/lib/api-error";
import type { SteadfastBulkOrderResult } from "@/types";
import { Input } from "@/components/ui/input";
import { GlowButton } from "@/components/forms/glow-button";

const MAX_ITEMS = 500;

const emptyItem = {
  invoice: "",
  recipient_name: "",
  recipient_address: "",
  recipient_phone: "",
  cod_amount: 0,
  note: "",
};

const cellInput =
  "h-auto rounded-lg border border-[#D4BFAA] bg-[#FCFAF8] px-3 py-2 text-xs text-[#4B2E2B] shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-4 focus-visible:ring-[#6B4A3D]/5";

export function BulkOrderForm() {
  const [results, setResults] = useState<SteadfastBulkOrderResult[] | null>(
    null,
  );
  const createBulkOrder = useCreateSteadfastBulkOrder();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSteadfastBulkOrderInput>({
    resolver: zodResolver(createSteadfastBulkOrderSchema),
    defaultValues: { data: [emptyItem] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "data" });

  const onSubmit = (values: CreateSteadfastBulkOrderInput) => {
    setResults(null);
    createBulkOrder.mutate(values, {
      onSuccess: (data) => {
        toast.success(`Submitted ${values.data.length} order(s) to Steadfast`);
        setResults(data);
        reset({ data: [emptyItem] });
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Failed to submit bulk order")),
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
            <Layers className="h-5 w-5 text-[#300332]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2D1B14]">Bulk Order Create</h2>
            <p className="text-xs text-[#8C6A5E]">
              {fields.length} / {MAX_ITEMS} orders
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => fields.length < MAX_ITEMS && append(emptyItem)}
          disabled={fields.length >= MAX_ITEMS}
          className="flex items-center gap-1.5 rounded-full bg-[#300332] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      {errors.data?.root?.message && (
        <p className="mb-4 text-xs text-red-500">{errors.data.root.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => {
            const rowErrors = errors.data?.[index];
            return (
              <div
                key={field.id}
                className="grid grid-cols-1 items-start gap-3 rounded-2xl border border-[#E8D8C3] bg-[#FDF8F3] p-4 md:grid-cols-6"
              >
                <div className="md:col-span-1">
                  <Input
                    {...register(`data.${index}.invoice`)}
                    placeholder="Invoice"
                    className={cellInput}
                  />
                  {rowErrors?.invoice && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {rowErrors.invoice.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <Input
                    {...register(`data.${index}.recipient_name`)}
                    placeholder="Recipient name"
                    className={cellInput}
                  />
                  {rowErrors?.recipient_name && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {rowErrors.recipient_name.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <Input
                    {...register(`data.${index}.recipient_phone`)}
                    placeholder="01XXXXXXXXX"
                    className={cellInput}
                  />
                  {rowErrors?.recipient_phone && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {rowErrors.recipient_phone.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Input
                    {...register(`data.${index}.recipient_address`)}
                    placeholder="Recipient address"
                    className={cellInput}
                  />
                  {rowErrors?.recipient_address && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {rowErrors.recipient_address.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 md:col-span-1">
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`data.${index}.cod_amount`)}
                    placeholder="COD"
                    className={cellInput}
                  />
                  <button
                    type="button"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length <= 1}
                    className="shrink-0 p-1.5 text-red-400 disabled:opacity-30"
                    aria-label="Remove row"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {rowErrors?.cod_amount && (
                  <p className="-mt-2 text-[10px] text-red-500 md:col-span-6">
                    {rowErrors.cod_amount.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <GlowButton
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#4B2E2B] py-3.5 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#4B2E2B]/20 transition-all hover:bg-[#321E1B]"
        >
          {isSubmitting
            ? "Submitting..."
            : `Submit ${fields.length} Order${fields.length > 1 ? "s" : ""}`}
        </GlowButton>
      </form>

      {results && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-bold tracking-wide text-[#4B2E2B] uppercase">
            Results
          </p>
          {results.map((r, i) => (
            <div
              key={`${r.invoice}-${i}`}
              className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs ${
                r.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="font-semibold">{r.invoice}</span>
              <span>{r.message || r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
