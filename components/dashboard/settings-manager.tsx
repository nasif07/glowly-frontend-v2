"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2, Wallet, Banknote, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/use-settings";
import { storeSettingsSchema, type StoreSettingsInput } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/api-error";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlowButton } from "@/components/forms/glow-button";

const cardStyle = "rounded-2xl border border-[#EFEBE9] bg-white p-5 md:p-6";
const labelStyle =
  "text-[13px] font-black text-[#8D6E63] mb-1.5 block uppercase tracking-wider";

/**
 * Store-wide payment policy. This applies to every product — there is no
 * per-product override, which is why it lives here rather than on the product
 * form.
 */
export function SettingsManager() {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();

  const form = useForm<StoreSettingsInput>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: { advanceRequired: true, advanceAmount: 200 },
  });

  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const advanceRequired = watch("advanceRequired");
  const advanceAmount = watch("advanceAmount");

  // Seed the form once the saved settings arrive.
  useEffect(() => {
    if (settings) {
      reset({
        advanceRequired: settings.advanceRequired,
        advanceAmount: settings.advanceAmount,
      });
    }
  }, [settings, reset]);

  const onSubmit = (values: StoreSettingsInput) => {
    updateSettings.mutate(values, {
      onSuccess: () => toast.success("Payment settings saved"),
      onError: (error) =>
        toast.error(getErrorMessage(error, "Failed to save settings")),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#A1887F]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Store Settings" Icon={Settings2} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-5"
        noValidate
      >
        <div className={cardStyle}>
          <h2 className="mb-1 text-lg font-black tracking-tight uppercase">
            Checkout Payment
          </h2>
          <p className="font-montserrat mb-5 text-sm text-[#8D6E63]">
            Applies to every product in the shop.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ModeCard
              selected={!advanceRequired}
              onSelect={() =>
                setValue("advanceRequired", false, { shouldDirty: true })
              }
              Icon={Banknote}
              title="Full Cash on Delivery"
              description="Customers pay the whole amount when the order arrives. No bKash step at checkout."
            />
            <ModeCard
              selected={advanceRequired}
              onSelect={() =>
                setValue("advanceRequired", true, { shouldDirty: true })
              }
              Icon={Wallet}
              title="Advance + Cash on Delivery"
              description="Customers send an advance via bKash, then pay the rest on delivery."
            />
          </div>
        </div>

        {advanceRequired && (
          <div className={cardStyle}>
            <label className={labelStyle} htmlFor="advanceAmount">
              Required Advance (৳)
            </label>
            <input
              id="advanceAmount"
              type="number"
              min={1}
              {...register("advanceAmount")}
              className="font-montserrat w-full max-w-xs rounded-xl border border-[#EFEBE9] bg-[#FAF9F6] px-4 py-3 text-base font-medium outline-none focus:border-[#A1887F]"
            />
            {formState.errors.advanceAmount && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600">
                <AlertCircle size={13} />
                {formState.errors.advanceAmount.message}
              </p>
            )}
            <p className="font-montserrat mt-3 text-sm text-[#8D6E63]">
              Checkout will read: “Advance Required: Please send ৳
              {advanceAmount || 0} via bKash. Rest is Cash on Delivery.”
            </p>
          </div>
        )}

        <GlowButton
          type="submit"
          disabled={updateSettings.isPending || !formState.isDirty}
          className="px-8 py-3.5"
        >
          {updateSettings.isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Save Settings"
          )}
        </GlowButton>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ModeCard({
  selected,
  onSelect,
  Icon,
  title,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  Icon: typeof Wallet;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-2xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-[#461149] bg-[#461149]/5"
          : "border-[#EFEBE9] bg-white hover:border-[#D9C5B2]"
      }`}
    >
      <Icon
        size={22}
        className={selected ? "text-[#461149]" : "text-[#A1887F]"}
      />
      <p className="mt-3 text-sm font-black tracking-tight text-[#2D1B14] uppercase">
        {title}
      </p>
      <p className="font-montserrat mt-1.5 text-xs leading-relaxed text-[#8D6E63]">
        {description}
      </p>
    </button>
  );
}
